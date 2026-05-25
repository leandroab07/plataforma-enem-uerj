#!/usr/bin/env python3
"""
Fase 1 — Etapa 1: Normalização das questões de origem.

Lê questoes_enem.json e questoes_uerj.json (via symlinks em content/questoes_origem/)
e produz content/questoes_normalizadas/enem.json e uerj.json no formato QuestaoNormalizada.
NUNCA modifica os arquivos de origem.
"""

import json
import re
import unicodedata
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[3]
ORIGEM_DIR = ROOT / "content" / "questoes_origem"
SAIDA_DIR  = ROOT / "content" / "questoes_normalizadas"
SAIDA_DIR.mkdir(parents=True, exist_ok=True)

ENUNCIADO_MIN_LEN = 50


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[\s_-]+", "_", text).strip("_")


def id_enem(q: dict) -> str:
    return f"ENEM-{q['year']}-{int(q['index']):03d}"


def id_uerj(q: dict) -> str:
    exame = slugify(q.get("exame", "desconhecido"))[:30]
    numero = int(q.get("numero", 0))
    return f"UERJ-{q['ano']}-{exame}-{numero:03d}"


def qualidade_enem(q: dict, enunciado: str, alternativas: dict) -> tuple[str, list[str]]:
    motivos = []
    if len(enunciado.strip()) < ENUNCIADO_MIN_LEN:
        motivos.append("enunciado_curto")
    if len(alternativas) < 5:
        motivos.append(f"alternativas_insuficientes:{len(alternativas)}")
    gabarito = q.get("correctAlternative", "")
    if gabarito and gabarito not in alternativas:
        motivos.append(f"gabarito_invalido:{gabarito}")
    if not gabarito:
        motivos.append("gabarito_ausente")
    return ("revisar" if motivos else "ok"), motivos


def qualidade_uerj(q: dict, enunciado: str, alternativas: dict) -> tuple[str, list[str]]:
    tipo = q.get("tipo", "objetiva")
    if tipo == "discursiva":
        # Discursivas entram como tipo especial, qualidade ok
        return "ok", []
    motivos = []
    if len(enunciado.strip()) < ENUNCIADO_MIN_LEN:
        motivos.append("enunciado_curto")
    if len(alternativas) < 4:
        motivos.append(f"alternativas_insuficientes:{len(alternativas)}")
    gabarito = q.get("gabarito") or ""
    if gabarito and alternativas and gabarito not in alternativas:
        motivos.append(f"gabarito_invalido:{gabarito}")
    if not gabarito and tipo == "objetiva":
        motivos.append("gabarito_ausente")
    return ("revisar" if motivos else "ok"), motivos


def normalizar_enem(questoes: list) -> tuple[list, dict]:
    resultado = []
    stats = {
        "total_origem": len(questoes),
        "ok": 0, "revisar": 0, "descartar": 0,
        "por_ano": {}, "por_disciplina": {},
        "motivos_revisao": {},
    }

    for q in questoes:
        ano = q.get("year")
        disciplina = q.get("discipline", "")
        context = (q.get("context") or "").strip()
        intro = (q.get("alternativesIntroduction") or "").strip()
        enunciado = context
        if intro:
            enunciado = (context + "\n\n" + intro) if context else intro

        alternativas: dict = {}
        for alt in q.get("alternatives", []):
            letra = alt.get("letter", "")
            texto = (alt.get("text") or "").strip()
            if letra:
                alternativas[letra] = texto

        gabarito = q.get("correctAlternative") or None
        imagens_locais = q.get("local_images") or []

        tags = []
        lang = q.get("language")
        if lang and lang not in ("", "null", None):
            tags.append(lang)

        qual, motivos = qualidade_enem(q, enunciado, alternativas)

        registro = {
            "id_origem":         id_enem(q),
            "prova":             "ENEM",
            "ano":               ano,
            "numero_original":   str(q.get("index", "")),
            "area_origem":       disciplina,
            "exame_uerj":        None,
            "tipo":              "objetiva",
            "enunciado":         enunciado,
            "alternativas":      alternativas,
            "gabarito":          gabarito,
            "dificuldade":       None,
            "tags_secundarias":  tags,
            "topico_id_sugerido": None,
            "imagens_locais":    imagens_locais,
            "qualidade":         qual,
            "motivo_revisao":    "; ".join(motivos) if motivos else None,
        }
        resultado.append(registro)

        stats["por_ano"].setdefault(ano, {"ok": 0, "revisar": 0, "descartar": 0})
        stats["por_disciplina"].setdefault(disciplina, {"ok": 0, "revisar": 0, "descartar": 0})
        stats[qual] += 1
        stats["por_ano"][ano][qual] += 1
        stats["por_disciplina"][disciplina][qual] += 1
        for m in motivos:
            stats["motivos_revisao"][m] = stats["motivos_revisao"].get(m, 0) + 1

    return resultado, stats


def normalizar_uerj(questoes: list) -> tuple[list, dict]:
    resultado = []
    stats = {
        "total_origem": len(questoes),
        "ok": 0, "revisar": 0, "descartar": 0,
        "por_ano": {}, "por_exame": {},
        "por_tipo": {"objetiva": 0, "discursiva": 0},
        "motivos_revisao": {},
    }

    for q in questoes:
        ano = q.get("ano")
        exame = q.get("exame", "")
        tipo = q.get("tipo", "objetiva")

        contexto = (q.get("contexto") or "").strip()
        enunciado_campo = (q.get("enunciado") or "").strip()
        enunciado = contexto
        if enunciado_campo:
            enunciado = (contexto + "\n\n" + enunciado_campo) if contexto else enunciado_campo

        raw_alts = q.get("alternativas") or {}
        alternativas: dict = {}
        if isinstance(raw_alts, dict):
            for letra, texto in raw_alts.items():
                alternativas[letra] = (texto or "").strip()
        elif isinstance(raw_alts, list):
            for item in raw_alts:
                letra = item.get("letter", "")
                texto = (item.get("text") or "").strip()
                if letra:
                    alternativas[letra] = texto

        gabarito = q.get("gabarito") or None
        imagens_locais = q.get("imagens") or []

        qual, motivos = qualidade_uerj(q, enunciado, alternativas)

        registro = {
            "id_origem":         id_uerj(q),
            "prova":             "UERJ",
            "ano":               ano,
            "numero_original":   str(q.get("numero", "")),
            "area_origem":       None,
            "exame_uerj":        exame,
            "tipo":              tipo,
            "enunciado":         enunciado,
            "alternativas":      alternativas,
            "gabarito":          gabarito,
            "dificuldade":       None,
            "tags_secundarias":  [],
            "topico_id_sugerido": None,
            "imagens_locais":    imagens_locais,
            "qualidade":         qual,
            "motivo_revisao":    "; ".join(motivos) if motivos else None,
        }
        resultado.append(registro)

        stats["por_ano"].setdefault(ano, {"ok": 0, "revisar": 0, "descartar": 0})
        stats["por_exame"].setdefault(exame, {"ok": 0, "revisar": 0, "descartar": 0})
        stats[qual] += 1
        stats["por_ano"][ano][qual] += 1
        stats["por_exame"][exame][qual] += 1
        stats["por_tipo"][tipo] = stats["por_tipo"].get(tipo, 0) + 1
        for m in motivos:
            stats["motivos_revisao"][m] = stats["motivos_revisao"].get(m, 0) + 1

    return resultado, stats


def main():
    print("Fase 1 — Normalização")
    print("=" * 50)

    enem_src = ORIGEM_DIR / "enem.json"
    uerj_src = ORIGEM_DIR / "uerj.json"

    print(f"Lendo {enem_src.resolve()} ...")
    with open(enem_src, encoding="utf-8") as f:
        enem_raw = json.load(f)

    print(f"Lendo {uerj_src.resolve()} ...")
    with open(uerj_src, encoding="utf-8") as f:
        uerj_raw = json.load(f)

    print()
    print("Normalizando ENEM ...")
    enem_norm, enem_stats = normalizar_enem(enem_raw)

    print("Normalizando UERJ ...")
    uerj_norm, uerj_stats = normalizar_uerj(uerj_raw)

    enem_out = SAIDA_DIR / "enem.json"
    uerj_out = SAIDA_DIR / "uerj.json"
    log_out  = SAIDA_DIR / "ingestao_log.json"

    with open(enem_out, "w", encoding="utf-8") as f:
        json.dump(enem_norm, f, ensure_ascii=False, indent=2)
    print(f"\nSalvo: {enem_out}  ({len(enem_norm)} questões)")

    with open(uerj_out, "w", encoding="utf-8") as f:
        json.dump(uerj_norm, f, ensure_ascii=False, indent=2)
    print(f"Salvo: {uerj_out}  ({len(uerj_norm)} questões)")

    log = {
        "gerado_em": datetime.now(timezone.utc).isoformat(),
        "fase": 1,
        "enem": enem_stats,
        "uerj": uerj_stats,
    }
    with open(log_out, "w", encoding="utf-8") as f:
        json.dump(log, f, ensure_ascii=False, indent=2)
    print(f"Salvo: {log_out}")

    print("\n--- ENEM ---")
    print(f"  Total origem:  {enem_stats['total_origem']}")
    print(f"  ok:            {enem_stats['ok']}")
    print(f"  revisar:       {enem_stats['revisar']}")
    print(f"  descartar:     {enem_stats['descartar']}")
    if enem_stats["motivos_revisao"]:
        print("  Motivos de revisão:")
        for m, c in sorted(enem_stats["motivos_revisao"].items(), key=lambda x: -x[1]):
            print(f"    {m}: {c}")

    print("\n--- UERJ ---")
    print(f"  Total origem:  {uerj_stats['total_origem']}")
    print(f"  ok:            {uerj_stats['ok']}")
    print(f"  revisar:       {uerj_stats['revisar']}")
    print(f"  descartar:     {uerj_stats['descartar']}")
    print(f"  objetiva:      {uerj_stats['por_tipo'].get('objetiva', 0)}")
    print(f"  discursiva:    {uerj_stats['por_tipo'].get('discursiva', 0)}")
    if uerj_stats["motivos_revisao"]:
        print("  Motivos de revisão:")
        for m, c in sorted(uerj_stats["motivos_revisao"].items(), key=lambda x: -x[1]):
            print(f"    {m}: {c}")

    print("\nConcluído.")
    return log


if __name__ == "__main__":
    main()
