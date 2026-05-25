#!/usr/bin/env python3
"""
Fase 3b — Aplica mapeamentos validados pelo humano de volta ao JSON normalizado.

Lê todos os CSVs em docs/mapeamentos/ e:
  - Para linhas com aprovado = 'sim': aplica topico_sugerido ao JSON.
  - Para linhas com aprovado = 'nao' e topico_corrigido preenchido: aplica topico_corrigido.
  - Para linhas com aprovado vazio: ignora (pendente de revisão).

Atualiza o campo topico_id_sugerido nos arquivos enem.json e uerj.json.
Gera docs/relatorios/fase-3b.md com estatísticas de cobertura.
"""

import csv
import json
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[3]
MAPEA_DIR = ROOT / "docs" / "mapeamentos"
ENEM_PATH = ROOT / "content" / "questoes_normalizadas" / "enem.json"
UERJ_PATH = ROOT / "content" / "questoes_normalizadas" / "uerj.json"
TOPICOS_PATH = ROOT / "content" / "topicos" / "todos.json"


def main():
    print("Fase 3b — Aplicando mapeamentos validados")
    print("=" * 50)

    # Carrega tópicos válidos
    with open(TOPICOS_PATH, encoding="utf-8") as f:
        todos_topicos = json.load(f)
    topico_ids_validos = {t["id"] for t in todos_topicos}

    # Lê todos os CSVs de mapeamento
    mapeamentos: dict[str, str] = {}  # id_origem → topico_id
    pendentes = 0
    aprovados = 0
    corrigidos = 0
    rejeitados = 0

    for csv_path in sorted(MAPEA_DIR.glob("*.csv")):
        with open(csv_path, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                id_origem = row.get("id_origem", "").strip()
                aprovado = (row.get("aprovado") or "").strip().lower()
                sugerido = (row.get("topico_sugerido") or "").strip()
                corrigido = (row.get("topico_corrigido") or "").strip()

                if not id_origem:
                    continue

                if aprovado in ("sim", "s", "yes", "y", "1"):
                    if sugerido in topico_ids_validos:
                        mapeamentos[id_origem] = sugerido
                        aprovados += 1
                    else:
                        print(f"  [!] Tópico sugerido inválido: {sugerido} ({id_origem})")
                elif aprovado in ("nao", "não", "n", "no", "0"):
                    if corrigido and corrigido in topico_ids_validos:
                        mapeamentos[id_origem] = corrigido
                        corrigidos += 1
                    elif corrigido:
                        print(f"  [!] Tópico corrigido inválido: {corrigido} ({id_origem})")
                        rejeitados += 1
                    else:
                        rejeitados += 1
                else:
                    pendentes += 1

    print(f"Aprovados (sugerido aceito): {aprovados}")
    print(f"Corrigidos (topico_corrigido): {corrigidos}")
    print(f"Rejeitados (sem topico_corrigido): {rejeitados}")
    print(f"Pendentes (aprovado vazio): {pendentes}")
    print(f"Total para aplicar: {len(mapeamentos)}")

    if not mapeamentos:
        print("\nNada para aplicar. Preencha os CSVs em docs/mapeamentos/ e re-execute.")
        return

    # Aplica ao ENEM
    with open(ENEM_PATH, encoding="utf-8") as f:
        enem_qs = json.load(f)

    aplicados_enem = 0
    for q in enem_qs:
        tid = mapeamentos.get(q["id_origem"])
        if tid:
            q["topico_id_sugerido"] = tid
            aplicados_enem += 1

    with open(ENEM_PATH, "w", encoding="utf-8") as f:
        json.dump(enem_qs, f, ensure_ascii=False, indent=2)
    print(f"\nEnem: {aplicados_enem} tópicos aplicados → {ENEM_PATH.name}")

    # Aplica ao UERJ
    with open(UERJ_PATH, encoding="utf-8") as f:
        uerj_qs = json.load(f)

    aplicados_uerj = 0
    for q in uerj_qs:
        tid = mapeamentos.get(q["id_origem"])
        if tid:
            q["topico_id_sugerido"] = tid
            aplicados_uerj += 1

    with open(UERJ_PATH, "w", encoding="utf-8") as f:
        json.dump(uerj_qs, f, ensure_ascii=False, indent=2)
    print(f"UERJ:  {aplicados_uerj} tópicos aplicados → {UERJ_PATH.name}")

    # Cobertura por tópico
    cobertura: dict[str, int] = defaultdict(int)
    for q in enem_qs + uerj_qs:
        tid = q.get("topico_id_sugerido")
        if tid:
            cobertura[tid] += 1

    # Relatório
    relatorio_path = ROOT / "docs" / "relatorios" / "fase-3b.md"
    with open(relatorio_path, "w", encoding="utf-8") as f:
        f.write("# Relatório — Fase 3b: Mapeamento Aplicado\n\n")
        f.write(f"**Data:** {__import__('datetime').date.today()}\n\n")
        f.write(f"| Métrica | Valor |\n|---|---|\n")
        f.write(f"| Aprovados | {aprovados} |\n")
        f.write(f"| Corrigidos | {corrigidos} |\n")
        f.write(f"| Rejeitados | {rejeitados} |\n")
        f.write(f"| Pendentes | {pendentes} |\n")
        f.write(f"| Aplicados ENEM | {aplicados_enem} |\n")
        f.write(f"| Aplicados UERJ | {aplicados_uerj} |\n\n")
        f.write("## Cobertura por tópico\n\n")
        f.write("| Tópico | Questões |\n|---|---|\n")
        for tid, cnt in sorted(cobertura.items(), key=lambda x: -x[1]):
            f.write(f"| {tid} | {cnt} |\n")

        # Tópicos sem nenhuma questão
        sem_questoes = [t["id"] for t in todos_topicos if cobertura.get(t["id"], 0) == 0]
        if sem_questoes:
            f.write(f"\n## Tópicos sem questões mapeadas ({len(sem_questoes)})\n\n")
            for tid in sem_questoes:
                f.write(f"- {tid}\n")

    print(f"\nRelatório: {relatorio_path}")


if __name__ == "__main__":
    main()
