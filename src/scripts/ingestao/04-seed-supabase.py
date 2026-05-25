#!/usr/bin/env python3
"""
Fase 4 — Seed do banco Supabase.

Carrega topicos, questoes e gabaritos nos schemas corretos via Supabase Admin API.
Requer: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente (ou .env).

Uso:
  export SUPABASE_URL=https://SEU_PROJETO.supabase.co
  export SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
  python3 04-seed-supabase.py

Ou com arquivo .env:
  python3 04-seed-supabase.py --env /caminho/.env
"""

import json
import os
import sys
import argparse
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
TOPICOS_PATH = ROOT / "content" / "topicos" / "todos.json"
ENEM_PATH = ROOT / "content" / "questoes_normalizadas" / "enem.json"
UERJ_PATH = ROOT / "content" / "questoes_normalizadas" / "uerj.json"

BATCH_SIZE = 100  # Supabase REST aceita até 1000 por requisição


def carregar_env(env_path: str | None) -> None:
    if not env_path:
        return
    with open(env_path) as f:
        for linha in f:
            linha = linha.strip()
            if linha and not linha.startswith("#") and "=" in linha:
                k, _, v = linha.partition("=")
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def supabase_request(url: str, service_key: str, method: str = "GET", data=None) -> dict | list:
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
            return json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        erro = e.read().decode()
        raise RuntimeError(f"HTTP {e.code} em {url}: {erro}")


def upsert_batch(base_url: str, service_key: str, tabela: str, linhas: list, schema: str = "public") -> None:
    url = f"{base_url}/rest/v1/{tabela}"
    headers_extra = f"?on_conflict=id" if schema == "public" else ""
    # Para o schema private, usamos o header Accept-Profile
    full_url = url + ("?on_conflict=questao_id" if tabela == "gabaritos" else "?on_conflict=id")

    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    if schema == "private":
        headers["Accept-Profile"] = "private"
        headers["Content-Profile"] = "private"

    body = json.dumps(linhas).encode()
    req = urllib.request.Request(full_url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            pass
    except urllib.error.HTTPError as e:
        erro = e.read().decode()
        raise RuntimeError(f"HTTP {e.code} em {full_url} [{schema}]: {erro[:300]}")


def seed_topicos(base_url: str, service_key: str, topicos: list) -> None:
    print(f"\n[1/3] Seedando {len(topicos)} tópicos...")
    linhas = [
        {
            "id": t["id"],
            "titulo": t["titulo"],
            "descricao": t.get("descricao"),
            "area": t["area"],
            "disciplina": t["disciplina"],
            "nivel": t["nivel"],
            "peso_enem_estimado": t.get("peso_enem_estimado"),
            "peso_uerj_estimado": t.get("peso_uerj_estimado"),
            "keywords": t.get("keywords", []),
        }
        for t in topicos
    ]

    for i in range(0, len(linhas), BATCH_SIZE):
        batch = linhas[i:i + BATCH_SIZE]
        upsert_batch(base_url, service_key, "topicos", batch)
        print(f"  → tópicos {i+1}–{i+len(batch)} inseridos")

    # Pre-requisitos
    prereqs = []
    for t in topicos:
        for pr in t.get("pre_requisitos", []):
            prereqs.append({"topico_id": t["id"], "prerequisito_id": pr})

    if prereqs:
        # Deletar existentes e reinserir
        del_url = f"{base_url}/rest/v1/pre_requisitos"
        headers = {
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Prefer": "return=minimal",
        }
        req = urllib.request.Request(del_url + "?topico_id=not.is.null", headers=headers, method="DELETE")
        try:
            urllib.request.urlopen(req, timeout=30)
        except Exception:
            pass

        for i in range(0, len(prereqs), BATCH_SIZE):
            batch = prereqs[i:i + BATCH_SIZE]
            url = f"{base_url}/rest/v1/pre_requisitos"
            body = json.dumps(batch).encode()
            req = urllib.request.Request(url, data=body, headers={
                "apikey": service_key,
                "Authorization": f"Bearer {service_key}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal",
            }, method="POST")
            urllib.request.urlopen(req, timeout=30)
        print(f"  → {len(prereqs)} pré-requisitos inseridos")


def seed_questoes(base_url: str, service_key: str, questoes: list) -> tuple[int, int]:
    """Retorna (total_questoes, total_gabaritos) inseridos."""
    ok_qs = [q for q in questoes if q.get("qualidade") == "ok" and q.get("tipo") == "objetiva"]
    print(f"\n[2/3] Seedando {len(ok_qs)} questões objetivas ok...")

    linhas_questoes = []
    linhas_gabaritos = []

    for q in ok_qs:
        lq = {
            "id_origem": q["id_origem"],
            "prova": q["prova"],
            "ano": q["ano"],
            "numero_original": q.get("numero_original"),
            "area_origem": q.get("area_origem"),
            "exame_uerj": q.get("exame_uerj"),
            "tipo": q.get("tipo", "objetiva"),
            "enunciado": q["enunciado"],
            "alternativas": q.get("alternativas", {}),
            "tags_secundarias": q.get("tags_secundarias"),
            "topico_id": q.get("topico_id_sugerido") or q.get("topico_id"),
            "imagens_locais": q.get("imagens_locais"),
            "qualidade": q.get("qualidade", "ok"),
            "motivo_revisao": q.get("motivo_revisao"),
        }
        linhas_questoes.append(lq)

        if q.get("gabarito"):
            linhas_gabaritos.append({
                "id_origem": q["id_origem"],  # para lookup após inserção
                "gabarito": q["gabarito"],
            })

    # Upsert questoes (public schema)
    for i in range(0, len(linhas_questoes), BATCH_SIZE):
        batch = linhas_questoes[i:i + BATCH_SIZE]
        url = f"{base_url}/rest/v1/questoes?on_conflict=id_origem"
        headers = {
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=representation",
        }
        body = json.dumps(batch).encode()
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                inserted = json.loads(resp.read())
                # Mapeia id_origem → uuid para usar nos gabaritos
                for row in inserted:
                    for lg in linhas_gabaritos:
                        if lg.get("id_origem") == row.get("id_origem"):
                            lg["questao_id"] = row["id"]
        except urllib.error.HTTPError as e:
            raise RuntimeError(f"Erro ao inserir questões: {e.read().decode()[:300]}")

        print(f"  → questões {i+1}–{i+len(batch)} inseridas")

    # Insere gabaritos no schema private
    gabaritos_prontos = [g for g in linhas_gabaritos if g.get("questao_id")]
    print(f"\n[3/3] Seedando {len(gabaritos_prontos)} gabaritos (schema private)...")

    for i in range(0, len(gabaritos_prontos), BATCH_SIZE):
        batch = gabaritos_prontos[i:i + BATCH_SIZE]
        payload = [{"questao_id": g["questao_id"], "gabarito": g["gabarito"]} for g in batch]
        url = f"{base_url}/rest/v1/gabaritos?on_conflict=questao_id"
        headers = {
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
            "Accept-Profile": "private",
            "Content-Profile": "private",
        }
        body = json.dumps(payload).encode()
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        try:
            urllib.request.urlopen(req, timeout=30)
        except urllib.error.HTTPError as e:
            raise RuntimeError(f"Erro ao inserir gabaritos: {e.read().decode()[:300]}")
        print(f"  → gabaritos {i+1}–{i+len(batch)} inseridos (private)")

    return len(ok_qs), len(gabaritos_prontos)


def main():
    parser = argparse.ArgumentParser(description="Seed Supabase — Fase 4")
    parser.add_argument("--env", help="Caminho para arquivo .env")
    parser.add_argument("--dry-run", action="store_true", help="Apenas valida, não insere")
    args = parser.parse_args()

    carregar_env(args.env)

    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

    if not supabase_url or not service_key:
        print("ERRO: Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente ou use --env.")
        sys.exit(1)

    print("Fase 4 — Seed Supabase")
    print("=" * 50)
    print(f"URL: {supabase_url}")

    with open(TOPICOS_PATH) as f:
        topicos = json.load(f)

    with open(ENEM_PATH) as f:
        enem_qs = json.load(f)

    with open(UERJ_PATH) as f:
        uerj_qs = json.load(f)

    todas_questoes = enem_qs + uerj_qs
    print(f"Tópicos: {len(topicos)}")
    print(f"Questões totais: {len(todas_questoes)}")

    ok_count = sum(1 for q in todas_questoes if q.get("qualidade") == "ok" and q.get("tipo") == "objetiva")
    com_gabarito = sum(1 for q in todas_questoes if q.get("qualidade") == "ok" and q.get("tipo") == "objetiva" and q.get("gabarito"))
    print(f"Questões ok (objetivas): {ok_count}")
    print(f"Com gabarito: {com_gabarito}")

    if args.dry_run:
        print("\n[dry-run] Tudo validado. Use sem --dry-run para inserir.")
        return

    seed_topicos(supabase_url, service_key, topicos)
    n_qs, n_gabs = seed_questoes(supabase_url, service_key, todas_questoes)

    print(f"\nConcluído!")
    print(f"  Tópicos: {len(topicos)}")
    print(f"  Questões: {n_qs}")
    print(f"  Gabaritos (private): {n_gabs}")


if __name__ == "__main__":
    main()
