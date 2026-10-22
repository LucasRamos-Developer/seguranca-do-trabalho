#!/usr/bin/env python3
"""Verifica as referências de js/data.js.

- Cada problema precisa ter um vídeo do problema (videoProblema), um vídeo da solução (videoSolucao)
  e pelo menos uma referência real (caso, imagem ou documento).
- Vídeos do YouTube: consulta o oEmbed para saber se o vídeo existe e se permite incorporação.
  Vídeos com embed:false só precisam existir (o site abre o link no YouTube).
- URLs: faz uma requisição GET e aceita 2xx/3xx (alguns sites bloqueiam robôs com 403; isso
  aparece como aviso, não como erro).
- Imagens locais: confere se o arquivo existe.

Uso: python3 tools/verificar-referencias.py
Saída com código 1 se houver erro.
"""
import json
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

RAIZ = pathlib.Path(__file__).resolve().parent.parent
DATA = (RAIZ / "js" / "data.js").read_text(encoding="utf-8")
UA = {"User-Agent": "Mozilla/5.0 (verificador de referencias - trabalho escolar)"}


def http_status(url):
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:  # timeout, DNS etc.
        return str(e)


def oembed(video_id):
    url = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(
        f"https://www.youtube.com/watch?v={video_id}"
    )
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status, json.load(resp).get("title", "")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return str(e), ""


def separar_problemas(texto):
    """Divide o array PROBLEMAS em blocos por 'id: N,'."""
    corpo = texto[texto.index("window.PROBLEMAS"):]
    partes = re.split(r"\n  \{\n    id: (\d+),", corpo)
    # partes = [prefixo, id1, bloco1, id2, bloco2, ...]
    return [(int(partes[i]), partes[i + 1]) for i in range(1, len(partes), 2)]


def main():
    erros, avisos = [], []
    caso_pecem = "CASO_PECEM" in DATA

    problemas = separar_problemas(DATA)
    if not problemas:
        print("Nenhum problema encontrado em js/data.js")
        return 1

    for pid, bloco in problemas:
        n_ref = len(re.findall(r"tipo: '(caso|imagem|documento)'", bloco))
        if caso_pecem:
            n_ref += bloco.count("CASO_PECEM")
        tem_vp = "videoProblema: {" in bloco
        tem_vs = "videoSolucao: {" in bloco
        ok = n_ref and tem_vp and tem_vs
        print(f"Problema {pid:2d}: {n_ref} referência(s) + vídeo problema {'ok' if tem_vp else 'FALTA'} + vídeo solução {'ok' if tem_vs else 'FALTA'}")
        if not n_ref:
            erros.append(f"problema {pid} sem referência real")
        if not tem_vp:
            erros.append(f"problema {pid} sem videoProblema")
        if not tem_vs:
            erros.append(f"problema {pid} sem videoSolucao")

    print("\nVídeos (oEmbed do YouTube):")
    for m in re.finditer(r"video(?:Problema|Solucao): \{ id: '([^']+)'[^}]*\}", DATA):
        vid = m.group(1)
        code, titulo = oembed(vid)
        if code == 200:
            print(f"  ok   {vid}  {titulo[:60]}")
        elif code in (401, 403):
            # o dono bloqueou a incorporação, mas o vídeo existe; o site só usa o link
            print(f"  ok   {vid}  (existe; incorporação bloqueada, não faz diferença)")
        else:
            erros.append(f"vídeo {vid} indisponível ({code})")
            print(f"  ERRO {vid}  indisponível ({code})")

    print("\nLinks:")
    urls = sorted(set(re.findall(r"url: '([^']+)'", DATA)))
    urls += re.findall(r"const NR_LISTA = '([^']+)'", DATA)
    # textos oficiais das NRs (js/nrs.js)
    nrs = (RAIZ / "js" / "nrs.js").read_text(encoding="utf-8")
    bases = dict(re.findall(r"const (VIG|ARQ) = '([^']+)'", nrs))
    urls += [bases[b] + arq for b, arq in re.findall(r"url: (VIG|ARQ) \+ '([^']+)'", nrs)]
    for url in sorted(set(urls)):
        code = http_status(url)
        if isinstance(code, int) and code < 400:
            print(f"  ok   {code}  {url}")
        elif code in (401, 403, 429, 503):
            avisos.append(f"{url} respondeu {code} (bloqueio a robôs?) — confira no navegador")
            print(f"  AVISO {code}  {url}")
        else:
            erros.append(f"{url} -> {code}")
            print(f"  ERRO {code}  {url}")

    print("\nImagens locais:")
    for src in re.findall(r"src: '([^']+)'", DATA):
        ok = (RAIZ / src).is_file()
        print(f"  {'ok  ' if ok else 'ERRO'} {src}")
        if not ok:
            erros.append(f"imagem {src} não existe")

    print()
    for a in avisos:
        print("AVISO:", a)
    for e in erros:
        print("ERRO:", e)
    print("\nResultado:", "FALHOU" if erros else "TUDO OK")
    return 1 if erros else 0


if __name__ == "__main__":
    sys.exit(main())
