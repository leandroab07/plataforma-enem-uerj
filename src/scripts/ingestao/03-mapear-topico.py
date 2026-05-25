#!/usr/bin/env python3
"""
Fase 3 — Mapeamento automático questão → tópico.

Para cada questão (ok, tipo objetiva), sugere um topico_id com score de confiança.
Estratégia em duas camadas:
  1. Keyword exact match: conta keywords do tópico presentes no enunciado.
  2. Stem match: variações morfológicas (remove sufixos comuns em português).

Fluxo:
  - ENEM: usa area_origem para filtrar tópicos candidatos.
  - UERJ: classifica área primeiro (step 0), depois tópico.

Saída: CSVs por área em docs/mapeamentos/ para revisão humana.
"""

import csv
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
TOPICOS_PATH = ROOT / "content" / "topicos" / "todos.json"
ENEM_PATH = ROOT / "content" / "questoes_normalizadas" / "enem.json"
UERJ_PATH = ROOT / "content" / "questoes_normalizadas" / "uerj.json"
MAPEA_DIR = ROOT / "docs" / "mapeamentos"
MAPEA_DIR.mkdir(parents=True, exist_ok=True)

# Mapeamento area_origem ENEM → area no schema de tópicos
AREA_MAP_ENEM = {
    "matematica":       "matematica",
    "ciencias-natureza": "ciencias-natureza",
    "ciencias-humanas": "ciencias-humanas",
    "linguagens":       "linguagens",
}

LIMIARES = {
    "alta":   0.35,  # confiança alta → provavelmente correto
    "media":  0.15,  # confiança média → provável mas revisar
    # abaixo de media = baixa
}


def normalizar(texto: str) -> str:
    """Lowercase, sem acentos, sem pontuação."""
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    texto = texto.lower()
    texto = re.sub(r"[^\w\s]", " ", texto)
    return re.sub(r"\s+", " ", texto).strip()


def stem_pt(token: str) -> str:
    """Stemming rudimentar para português: remove sufixos comuns."""
    sufixos = ["ção", "ções", "mente", "dade", "ismo", "ista", "icos", "icas",
               "ico", "ica", "ões", "ão", "as", "os", "es", "s", "ar", "er",
               "ir", "ando", "endo", "indo", "ado", "ido", "ada", "ida"]
    for suf in sufixos:
        if token.endswith(suf) and len(token) - len(suf) >= 4:
            return token[: len(token) - len(suf)]
    return token


def tokenizar(texto: str) -> set[str]:
    tokens = normalizar(texto).split()
    stop = {"de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas",
            "um", "uma", "uns", "umas", "o", "a", "os", "as", "e", "ou",
            "que", "com", "por", "para", "se", "ao", "aos", "à", "às",
            "pela", "pelo", "pelas", "pelos", "ser", "ter", "é", "são",
            "foi", "era", "está", "são", "como", "mas", "mais", "não"}
    return {stem_pt(t) for t in tokens if t not in stop and len(t) >= 3}


def score_topico(enunciado_tokens: set[str], alternativas_tokens: set[str],
                 topico: dict, texto_normalizado: str = "") -> float:
    """
    Score de relevância.
    - Keywords de 1 palavra: match via stem.
    - Keywords de 2+ palavras: frase exata no texto normalizado (evita falsos positivos).
    Peso: 3x para frase exata, 1x para stem de 1 palavra.
    """
    texto_completo = enunciado_tokens | alternativas_tokens
    keywords_raw = [normalizar(k) for k in topico.get("keywords", [])]

    if not keywords_raw:
        return 0.0

    score = 0.0
    for kw in keywords_raw:
        palavras = kw.split()
        if len(palavras) == 1:
            # Palavra única: stem match
            s = stem_pt(palavras[0])
            if s in {stem_pt(t) for t in texto_completo}:
                score += 1.0
        else:
            # Frase: busca substring exata no texto normalizado
            if texto_normalizado and kw in texto_normalizado:
                score += 3.0
            else:
                # Fallback: todas as palavras da frase presentes (mas não como falso positivo)
                # Exige que TODAS as palavras estejam presentes E sejam raras
                palavras_relevantes = [p for p in palavras if len(p) >= 5]
                if palavras_relevantes and all(
                    stem_pt(p) in {stem_pt(t) for t in texto_completo}
                    for p in palavras_relevantes
                ):
                    score += 1.5

    return score / len(keywords_raw)


def classificar_area_uerj(texto: str, topicos_por_area: dict[str, list]) -> str | None:
    """Classifica área de uma questão UERJ (sem area_origem)."""
    tokens = tokenizar(texto)
    texto_norm = normalizar(texto)
    melhor_area, melhor_score = None, 0.0

    for area, topicos in topicos_por_area.items():
        score_area = 0.0
        for t in topicos:
            s = score_topico(tokens, set(), t, texto_norm)
            if s > score_area:
                score_area = s
        if score_area > melhor_score:
            melhor_score = score_area
            melhor_area = area

    return melhor_area if melhor_score >= 0.05 else None


def mapear_questoes(questoes: list[dict], topicos_area: list[dict],
                    area_label: str) -> list[dict]:
    """Retorna lista de registros de mapeamento para o CSV."""
    resultados = []
    for q in questoes:
        enunciado_raw = q.get("enunciado", "")
        alts_text = " ".join((q.get("alternativas") or {}).values())
        texto_completo_raw = enunciado_raw + " " + alts_text
        texto_norm = normalizar(texto_completo_raw)

        enunciado_tokens = tokenizar(enunciado_raw)
        alt_tokens = tokenizar(alts_text)

        scores = []
        for t in topicos_area:
            s = score_topico(enunciado_tokens, alt_tokens, t, texto_norm)
            scores.append((t["id"], t["titulo"], s))

        scores.sort(key=lambda x: -x[2])

        top1_id, top1_titulo, top1_score = scores[0] if scores else ("", "", 0.0)
        top2_id, top2_titulo, top2_score = scores[1] if len(scores) > 1 else ("", "", 0.0)
        top3_id, top3_titulo, top3_score = scores[2] if len(scores) > 2 else ("", "", 0.0)

        confianca = (
            "alta"  if top1_score >= LIMIARES["alta"]  else
            "media" if top1_score >= LIMIARES["media"] else
            "baixa"
        )

        resultados.append({
            "id_origem":        q["id_origem"],
            "prova":            q["prova"],
            "ano":              q.get("ano"),
            "numero":           q.get("numero_original"),
            "area":             area_label,
            "topico_sugerido":  top1_id,
            "topico_titulo":    top1_titulo,
            "confianca":        confianca,
            "score":            f"{top1_score:.3f}",
            "alternativa_2":    top2_id,
            "alternativa_3":    top3_id,
            "enunciado_100":    (q.get("enunciado") or "")[:100].replace("\n", " "),
            "aprovado":         "",      # preencher manualmente
            "topico_corrigido": "",      # preencher se aprovado = 'não'
        })
    return resultados


def escrever_csv(resultados: list[dict], path: Path) -> None:
    campos = [
        "id_origem", "prova", "ano", "numero", "area",
        "topico_sugerido", "topico_titulo", "confianca", "score",
        "alternativa_2", "alternativa_3",
        "enunciado_100",
        "aprovado", "topico_corrigido",
    ]
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=campos)
        w.writeheader()
        w.writerows(resultados)


def main():
    print("Fase 3 — Mapeamento questão → tópico")
    print("=" * 50)

    with open(TOPICOS_PATH, encoding="utf-8") as f:
        todos_topicos = json.load(f)

    with open(ENEM_PATH, encoding="utf-8") as f:
        enem_qs = json.load(f)

    with open(UERJ_PATH, encoding="utf-8") as f:
        uerj_qs = json.load(f)

    # Agrupa tópicos por area
    topicos_por_area: dict[str, list] = {}
    for t in todos_topicos:
        area = t["area"]
        topicos_por_area.setdefault(area, []).append(t)

    # Tópicos de matematica separados para referência
    topicos_mat = topicos_por_area.get("matematica", [])

    # Áreas a processar — na ordem de revisão
    AREAS_PROCESSAR = [
        ("matematica",       "matematica"),
        ("ciencias-natureza","ciencias-natureza"),
        ("ciencias-humanas", "ciencias-humanas"),
        ("linguagens",       "linguagens"),
    ]

    total_mapeado = 0
    resumo: list[dict] = []

    for area_enem, area_topico in AREAS_PROCESSAR:
        topicos_area = topicos_por_area.get(area_topico, [])
        if not topicos_area:
            print(f"\n[!] Sem tópicos para área {area_topico}")
            continue

        # ── ENEM ──────────────────────────────────────────────────
        enem_area = [
            q for q in enem_qs
            if q.get("area_origem") == area_enem
            and q.get("qualidade") == "ok"
            and q.get("tipo") == "objetiva"
        ]
        print(f"\n[{area_enem}] ENEM: {len(enem_area)} questões | tópicos: {len(topicos_area)}")

        if enem_area:
            res_enem = mapear_questoes(enem_area, topicos_area, area_enem)
            path_enem = MAPEA_DIR / f"enem_{area_enem.replace('-','_')}.csv"
            escrever_csv(res_enem, path_enem)

            alta  = sum(1 for r in res_enem if r["confianca"] == "alta")
            media = sum(1 for r in res_enem if r["confianca"] == "media")
            baixa = sum(1 for r in res_enem if r["confianca"] == "baixa")
            print(f"  → alta:{alta} ({100*alta//len(res_enem)}%)  media:{media}  baixa:{baixa}")
            print(f"  → CSV: {path_enem.name}")
            total_mapeado += len(res_enem)
            resumo.append({"prova": "ENEM", "area": area_enem,
                           "total": len(res_enem), "alta": alta, "media": media, "baixa": baixa})

        # ── UERJ ──────────────────────────────────────────────────
        # Classifica área das questões UERJ
        uerj_area = []
        for q in uerj_qs:
            if q.get("tipo") != "objetiva" or q.get("qualidade") != "ok":
                continue
            enunciado = q.get("enunciado", "")
            alts = " ".join((q.get("alternativas") or {}).values())
            area_inferida = classificar_area_uerj(enunciado + " " + alts, topicos_por_area)
            if area_inferida == area_topico:
                uerj_area.append(q)

        print(f"[{area_enem}] UERJ (inferida): {len(uerj_area)} questões")

        if uerj_area:
            res_uerj = mapear_questoes(uerj_area, topicos_area, area_enem)
            path_uerj = MAPEA_DIR / f"uerj_{area_enem.replace('-','_')}.csv"
            escrever_csv(res_uerj, path_uerj)

            alta  = sum(1 for r in res_uerj if r["confianca"] == "alta")
            media = sum(1 for r in res_uerj if r["confianca"] == "media")
            baixa = sum(1 for r in res_uerj if r["confianca"] == "baixa")
            print(f"  → alta:{alta} ({100*alta//len(res_uerj) if res_uerj else 0}%)  media:{media}  baixa:{baixa}")
            print(f"  → CSV: {path_uerj.name}")
            total_mapeado += len(res_uerj)
            resumo.append({"prova": "UERJ", "area": area_enem,
                           "total": len(res_uerj), "alta": alta, "media": media, "baixa": baixa})

    print(f"\nTotal mapeado: {total_mapeado} questões")
    print("CSVs em:", MAPEA_DIR)

    # Salva resumo
    resumo_path = MAPEA_DIR / "resumo_mapeamento.json"
    with open(resumo_path, "w", encoding="utf-8") as f:
        json.dump(resumo, f, ensure_ascii=False, indent=2)

    return resumo


if __name__ == "__main__":
    main()
