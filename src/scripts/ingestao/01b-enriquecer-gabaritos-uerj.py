#!/usr/bin/env python3
"""
Fase 2 — Enriquecimento de gabaritos UERJ.

Problema: PDFs 2014-2019 não têm label explícita 'Gabarito: X'.
Solução: Para 2020+, usa PyMuPDF (mais fiel) com busca retroativa melhorada.
         Para 2014-2019, cria template JSON para preenchimento manual.

Atualiza content/questoes_normalizadas/uerj.json com os gabaritos recuperados.
NUNCA modifica os arquivos de origem.
"""

import io
import json
import re
import warnings
from pathlib import Path

import fitz  # pymupdf
import requests

warnings.filterwarnings("ignore")

ROOT = Path(__file__).resolve().parents[3]
SAIDA_DIR = ROOT / "content" / "questoes_normalizadas"
MANUAL_FILE = SAIDA_DIR / "gabaritos_manuais_uerj.json"

BASE_URL = "https://www.revista.vestibular.uerj.br"

# PDFs que TÊM 'Gabarito: X.' inline (2020+)
PDF_COM_GABARITO = [
    (2026, "1º Exame de Qualificação",  "/arquivos/pdf/questao/53.pdf"),
    (2026, "2º Exame de Qualificação",  "/arquivos/pdf/questao/54.pdf"),
    (2025, "1º Exame de Qualificação",  "/arquivos/pdf/questao/47.pdf"),
    (2025, "2º Exame de Qualificação",  "/arquivos/pdf/questao/49.pdf"),
    (2024, "1º Exame de Qualificação",  "/arquivos/pdf/questao/44.pdf"),
    (2024, "2º Exame de Qualificação",  "/arquivos/pdf/questao/45.pdf"),
    (2023, "Exame Único",               "/arquivos/pdf/questao/42.pdf"),
    (2022, "Exame Único",               "/arquivos/pdf/questao/40.pdf"),
    (2020, "1º Exame de Qualificação",  "/arquivos/pdf/questao/35.pdf"),
    (2020, "2º Exame de Qualificação",  "/arquivos/pdf/questao/36.pdf"),
]

# PDFs SEM gabarito inline — criar template para preenchimento manual
PDF_SEM_GABARITO = [
    (2019, "1º Exame de Qualificação",  "/arquivos/pdf/questao/32.pdf"),
    (2019, "2º Exame de Qualificação",  "/arquivos/pdf/questao/33.pdf"),
    (2018, "1º Exame de Qualificação",  "/arquivos/pdf/questao/29.pdf"),
    (2018, "2º Exame de Qualificação",  "/arquivos/pdf/questao/30.pdf"),
    (2017, "1º Exame de Qualificação",  "/arquivos/pdf/questao/26.pdf"),
    (2017, "2º Exame de Qualificação",  "/arquivos/pdf/questao/27.pdf"),
    (2015, "1º Exame de Qualificação",  "/arquivos/pdf/questao/20.pdf"),
    (2015, "2º Exame de Qualificação",  "/arquivos/pdf/questao/21.pdf"),
    (2014, "1º Exame de Qualificação",  "/arquivos/pdf/questao/17.pdf"),
    (2014, "2º Exame de Qualificação",  "/arquivos/pdf/questao/18.pdf"),
]

RE_GAB = re.compile(r"[Gg]abarito:\s*([A-D])[.\s]")
RE_QUESTAO_NUM = re.compile(r"QUEST[ÃA]O\s*\n?(\d{1,2})\b", re.IGNORECASE)


def fetch_pdf(url: str) -> bytes | None:
    try:
        r = requests.get(url, verify=False, timeout=45)
        if r.status_code == 200 and b"%PDF" in r.content[:10]:
            return r.content
        print(f"  HTTP {r.status_code}: {url}")
    except Exception as e:
        print(f"  Erro ao baixar {url}: {e}")
    return None


def extrair_gabaritos_pdf(pdf_bytes: bytes) -> dict[int, str]:
    """
    Extrai mapa {numero: letra} de um PDF 2020+ usando PyMuPDF.
    Estratégia: para cada 'Gabarito: X', busca o último QUESTÃO NN antes.
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    full = "\n".join(doc[i].get_text() for i in range(len(doc)))

    gabaritos: dict[int, str] = {}
    for m in RE_GAB.finditer(full):
        preceding = full[: m.start()]
        q_matches = list(RE_QUESTAO_NUM.finditer(preceding))
        if q_matches:
            num = int(q_matches[-1].group(1))
            if 1 <= num <= 60 and num not in gabaritos:
                gabaritos[num] = m.group(1).upper()
    return gabaritos


def normalizar_exame(exame: str) -> str:
    """Retorna slug de exame no formato esperado em uerj.json."""
    import unicodedata

    s = unicodedata.normalize("NFD", exame)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^\w\s-]", "", s.lower()).strip().replace(" ", "_")


def main():
    print("Fase 2 — Enriquecimento de gabaritos UERJ")
    print("=" * 50)

    uerj_path = SAIDA_DIR / "uerj.json"
    with open(uerj_path, encoding="utf-8") as f:
        questoes = json.load(f)

    # Índice: (ano, exame_normalizado, numero) → posição na lista
    idx: dict[tuple, int] = {}
    for i, q in enumerate(questoes):
        if q.get("tipo") == "objetiva":
            exame_slug = normalizar_exame(q.get("exame_uerj", ""))
            num = int(q.get("numero_original", 0) or 0)
            idx[(q.get("ano"), exame_slug, num)] = i

    stats = {
        "recuperados": 0,
        "ja_tinha_gabarito": 0,
        "sem_match_no_json": 0,
        "por_ano": {},
    }

    # ─── 2020+ PDFs: extração automática ───────────────────────────────────
    print("\n[1/2] Extraindo gabaritos de PDFs 2020+...")
    for ano, exame, path in PDF_COM_GABARITO:
        url = BASE_URL + path
        print(f"  {ano} {exame} ...", end=" ", flush=True)
        pdf_bytes = fetch_pdf(url)
        if pdf_bytes is None:
            print("ERRO")
            continue

        gabaritos = extrair_gabaritos_pdf(pdf_bytes)
        exame_slug = normalizar_exame(exame)
        print(f"{len(gabaritos)} gabaritos extraídos")

        recuperados_exame = 0
        for num, letra in gabaritos.items():
            key = (ano, exame_slug, num)
            if key in idx:
                q = questoes[idx[key]]
                if not q.get("gabarito"):
                    q["gabarito"] = letra
                    if q.get("qualidade") == "revisar" and "gabarito_ausente" in (q.get("motivo_revisao") or ""):
                        # Remove gabarito_ausente do motivo; verifica demais condições
                        motivos = [
                            m for m in (q.get("motivo_revisao") or "").split("; ")
                            if m != "gabarito_ausente"
                        ]
                        if not motivos:
                            q["qualidade"] = "ok"
                            q["motivo_revisao"] = None
                        else:
                            q["motivo_revisao"] = "; ".join(motivos)
                    recuperados_exame += 1
                    stats["recuperados"] += 1
                else:
                    stats["ja_tinha_gabarito"] += 1
            else:
                stats["sem_match_no_json"] += 1

        stats["por_ano"].setdefault(ano, 0)
        stats["por_ano"][ano] += recuperados_exame

    # ─── 2014-2019: template para preenchimento manual ─────────────────────
    print("\n[2/2] Gerando template para 2014-2019...")

    # Carrega template existente se houver
    if MANUAL_FILE.exists():
        with open(MANUAL_FILE, encoding="utf-8") as f:
            manual_data = json.load(f)
    else:
        manual_data = {}

    for ano, exame, _ in PDF_SEM_GABARITO:
        exame_slug = normalizar_exame(exame)
        chave = f"{ano}_{exame_slug}"

        # Encontra os números de questão que ainda estão sem gabarito
        numeros_sem_gab = []
        for (q_ano, q_exame_slug, q_num), i in idx.items():
            if q_ano == ano and q_exame_slug == exame_slug:
                if not questoes[i].get("gabarito"):
                    numeros_sem_gab.append(q_num)

        if not numeros_sem_gab:
            continue

        numeros_sem_gab.sort()
        print(f"  Template {ano} {exame}: {len(numeros_sem_gab)} questões")

        if chave not in manual_data:
            manual_data[chave] = {
                "ano": ano,
                "exame": exame,
                "_instrucao": (
                    "Preencha 'gabarito' com A, B, C ou D para cada questão. "
                    "Execute novamente 01b-enriquecer-gabaritos-uerj.py para aplicar."
                ),
                "questoes": {
                    str(num): {"gabarito": None}
                    for num in numeros_sem_gab
                },
            }
        else:
            # Adiciona entradas novas sem sobrescrever preenchidas
            for num in numeros_sem_gab:
                if str(num) not in manual_data[chave]["questoes"]:
                    manual_data[chave]["questoes"][str(num)] = {"gabarito": None}

    with open(MANUAL_FILE, "w", encoding="utf-8") as f:
        json.dump(manual_data, f, ensure_ascii=False, indent=2)
    print(f"\nTemplate salvo em: {MANUAL_FILE}")

    # ─── Aplica gabaritos manuais preenchidos ──────────────────────────────
    aplicados_manual = 0
    for chave, data in manual_data.items():
        ano = data["ano"]
        exame = data["exame"]
        exame_slug = normalizar_exame(exame)
        for num_str, info in data.get("questoes", {}).items():
            letra = (info.get("gabarito") or "").upper().strip()
            if letra not in ("A", "B", "C", "D"):
                continue
            key = (ano, exame_slug, int(num_str))
            if key in idx:
                q = questoes[idx[key]]
                if not q.get("gabarito"):
                    q["gabarito"] = letra
                    motivos = [
                        m for m in (q.get("motivo_revisao") or "").split("; ")
                        if m != "gabarito_ausente"
                    ]
                    if not motivos:
                        q["qualidade"] = "ok"
                        q["motivo_revisao"] = None
                    else:
                        q["motivo_revisao"] = "; ".join(motivos)
                    aplicados_manual += 1
                    stats["recuperados"] += 1

    # ─── Salva uerj.json atualizado ────────────────────────────────────────
    with open(uerj_path, "w", encoding="utf-8") as f:
        json.dump(questoes, f, ensure_ascii=False, indent=2)

    print("\n=== Resultado ===")
    print(f"Gabaritos recuperados (auto):   {stats['recuperados'] - aplicados_manual}")
    print(f"Gabaritos aplicados (manual):   {aplicados_manual}")
    print(f"Já tinham gabarito:             {stats['ja_tinha_gabarito']}")
    print(f"Sem match no JSON:              {stats['sem_match_no_json']}")
    print(f"Por ano (novos):")
    for ano in sorted(stats["por_ano"]):
        print(f"  {ano}: {stats['por_ano'][ano]}")
    print(f"\nurj.json atualizado em: {uerj_path}")
    print(
        "\n[AÇÃO NECESSÁRIA] Para 2014-2019, preencha os gabaritos em:\n"
        f"  {MANUAL_FILE}\n"
        "e execute este script novamente."
    )


if __name__ == "__main__":
    main()
