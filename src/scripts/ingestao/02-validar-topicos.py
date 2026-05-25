#!/usr/bin/env python3
"""
Fase 2 — Validação do grafo de tópicos.

Lê todos os topicos.json, valida:
  - Nenhum tópico referencia um pre_requisito inexistente
  - O grafo de pre_requisitos é um DAG (sem ciclos)
  - Unicidade de IDs
  - Campos obrigatórios presentes

Produz content/topicos/todos.json (merge de todas as áreas).
"""

import json
from pathlib import Path
from collections import deque

ROOT = Path(__file__).resolve().parents[3]
TOPICOS_DIR = ROOT / "content" / "topicos"

AREAS = ["matematica", "fisica", "quimica", "biologia", "historia", "geografia", "filosofia", "sociologia", "linguagens"]
CAMPOS_OBRIGATORIOS = ["id", "titulo", "descricao", "area", "disciplina", "nivel", "pre_requisitos", "keywords"]


def load_all_topics() -> list[dict]:
    todos = []
    for area in AREAS:
        path = TOPICOS_DIR / area / "topicos.json"
        if not path.exists():
            print(f"  AVISO: {path} não encontrado")
            continue
        with open(path, encoding="utf-8") as f:
            topicos = json.load(f)
        print(f"  {area}: {len(topicos)} tópicos")
        todos.extend(topicos)
    return todos


def validar_campos(topicos: list[dict]) -> list[str]:
    erros = []
    for t in topicos:
        for campo in CAMPOS_OBRIGATORIOS:
            if campo not in t:
                erros.append(f"[{t.get('id','?')}] campo obrigatório ausente: {campo}")
        nivel = t.get("nivel")
        if nivel not in (1, 2, 3, 4):
            erros.append(f"[{t.get('id','?')}] nivel inválido: {nivel}")
    return erros


def validar_unicidade(topicos: list[dict]) -> list[str]:
    erros = []
    visto = {}
    for t in topicos:
        tid = t.get("id", "")
        if tid in visto:
            erros.append(f"ID duplicado: {tid}")
        visto[tid] = True
    return erros


def validar_prereqs(topicos: list[dict]) -> list[str]:
    erros = []
    ids = {t["id"] for t in topicos}
    for t in topicos:
        for prereq in t.get("pre_requisitos", []):
            if prereq not in ids:
                erros.append(f"[{t['id']}] pre_requisito inexistente: {prereq}")
    return erros


def detectar_ciclos(topicos: list[dict]) -> list[str]:
    """Kahn's algorithm — topological sort. Ciclo se sobrar nó não processado."""
    ids = {t["id"] for t in topicos}
    grafo: dict[str, list[str]] = {t["id"]: list(t.get("pre_requisitos", [])) for t in topicos}

    # Grau de entrada (quantos pre_requisitos cada nó tem)
    grau_entrada: dict[str, int] = {tid: 0 for tid in ids}
    filhos: dict[str, list[str]] = {tid: [] for tid in ids}  # quem depende de tid

    for tid, prereqs in grafo.items():
        grau_entrada[tid] += len([p for p in prereqs if p in ids])
        for p in prereqs:
            if p in ids:
                filhos[p].append(tid)

    fila = deque([tid for tid, grau in grau_entrada.items() if grau == 0])
    processados = 0

    while fila:
        current = fila.popleft()
        processados += 1
        for filho in filhos[current]:
            grau_entrada[filho] -= 1
            if grau_entrada[filho] == 0:
                fila.append(filho)

    erros = []
    if processados < len(ids):
        # Há ciclo — encontrar quais nós estão em ciclo
        em_ciclo = [tid for tid, grau in grau_entrada.items() if grau > 0]
        erros.append(f"CICLO detectado nos tópicos: {em_ciclo}")
    return erros


def main():
    print("Fase 2 — Validação do grafo de tópicos")
    print("=" * 50)
    print("Carregando tópicos:")

    topicos = load_all_topics()
    total = len(topicos)
    print(f"\nTotal: {total} tópicos\n")

    erros: list[str] = []

    print("Validando campos obrigatórios...")
    erros += validar_campos(topicos)

    print("Validando unicidade de IDs...")
    erros += validar_unicidade(topicos)

    print("Validando referências de pré-requisitos...")
    erros += validar_prereqs(topicos)

    print("Verificando ciclos (DAG)...")
    erros += detectar_ciclos(topicos)

    if erros:
        print(f"\n❌ {len(erros)} erro(s) encontrado(s):")
        for e in erros:
            print(f"  - {e}")
    else:
        print("\n✓ Grafo válido — sem ciclos, sem referências quebradas")

    # Estatísticas por área
    print("\n--- Resumo por área ---")
    por_area: dict[str, dict] = {}
    for t in topicos:
        area = t.get("area", "?")
        disciplina = t.get("disciplina", "?")
        nivel = t.get("nivel", 0)
        por_area.setdefault(area, {"total": 0, "disciplinas": set(), "niveis": {}})
        por_area[area]["total"] += 1
        por_area[area]["disciplinas"].add(disciplina)
        por_area[area]["niveis"][nivel] = por_area[area]["niveis"].get(nivel, 0) + 1

    for area in sorted(por_area):
        d = por_area[area]
        niveis_str = " | ".join(f"N{k}:{v}" for k, v in sorted(d["niveis"].items()))
        print(f"  {area}: {d['total']} tópicos ({niveis_str})")

    # Topologia — raízes e folhas
    ids = {t["id"] for t in topicos}
    raizes = [t["id"] for t in topicos if not t.get("pre_requisitos")]
    filhos_count: dict[str, int] = {tid: 0 for tid in ids}
    for t in topicos:
        for p in t.get("pre_requisitos", []):
            if p in filhos_count:
                filhos_count[p] += 1
    folhas = [tid for tid, cnt in filhos_count.items() if cnt == 0]

    print(f"\n  Raízes (sem pré-requisitos): {len(raizes)}")
    print(f"  Folhas (sem dependentes):    {len(folhas)}")

    # Salva merge
    saida = ROOT / "content" / "topicos" / "todos.json"
    with open(saida, "w", encoding="utf-8") as f:
        json.dump(topicos, f, ensure_ascii=False, indent=2, default=list)

    # Converte sets para listas antes de salvar
    for t in topicos:
        pass  # já é dict, sem sets

    with open(saida, "w", encoding="utf-8") as f:
        json.dump(topicos, f, ensure_ascii=False, indent=2)

    print(f"\nMerge salvo em: {saida}")
    print(f"\n{'✓ Validação concluída com sucesso' if not erros else '❌ Validação com erros'}")
    return len(erros) == 0


if __name__ == "__main__":
    ok = main()
    exit(0 if ok else 1)
