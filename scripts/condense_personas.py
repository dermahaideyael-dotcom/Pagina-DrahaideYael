#!/usr/bin/env python3
"""Condensa un archivo de personas de synthetic-identity-architect a una
versión liviana, para subir en el paso de grafo/ontología de MiroFish sin
generar cientos de fragmentos que excedan el timeout fijo de Zep Cloud
(ZEP_INGESTION_WAIT_TIMEOUT_SECONDS = 600s, ver MiroFish/backend/app/utils/zep.py).

El archivo completo (30+ campos por persona) sigue siendo la fuente de
verdad -- esto solo genera una versión resumida para la etapa de
construcción del grafo. simulation_requirement sigue exigiendo instanciar
exactamente estas identidades.

Uso:
    python condense_personas.py <archivo_completo.md> [-o salida.md]
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

AGENT_SPLIT_RE = re.compile(r"^#{0,6}\s*AGENT ID:\s*(\S+)\s*$", flags=re.MULTILINE)

FIELD_LABELS = {
    "nombre": ["NOMBRE SINTÉTICO"],
    "arquetipo": ["ARQUETIPO"],
    "situacion": ["SITUACIÓN ACTUAL"],
    "motivacion": ["MOTIVACIÓN PRINCIPAL"],
    "causa_percibida": ["CAUSA QUE LA PERSONA CREE QUE EXISTE"],
    "objeciones": ["OBJECIONES"],
    "search": ["GOOGLE SEARCH INICIAL"],
}


def extract_field(block: str, labels: list[str]) -> str:
    """Extrae el texto de un campo '**LABEL:**\n texto' (case-insensitive,
    tolera 'Label:' en vez de 'LABEL:'), hasta el próximo campo en negrita
    o el final del bloque."""
    for label in labels:
        pattern = re.compile(
            r"\*\*" + re.escape(label) + r":?\*\*\s*\n?(.*?)(?=\n\*\*[^\n]+\*\*|\Z)",
            flags=re.IGNORECASE | re.DOTALL,
        )
        m = pattern.search(block)
        if m:
            text = m.group(1).strip()
            # Primera línea/oración no vacía, para mantenerlo corto.
            first_line = next((l.strip("- ").strip() for l in text.splitlines() if l.strip()), "")
            return first_line
    return ""


def condense(full_text: str) -> tuple[str, int]:
    ids = AGENT_SPLIT_RE.findall(full_text)
    blocks = AGENT_SPLIT_RE.split(full_text)[1:]  # [id1, block1, id2, block2, ...]

    entries = []
    for i in range(0, len(blocks), 2):
        agent_id = blocks[i]
        block = blocks[i + 1]
        nombre = extract_field(block, FIELD_LABELS["nombre"])
        arquetipo = extract_field(block, FIELD_LABELS["arquetipo"])
        situacion = extract_field(block, FIELD_LABELS["situacion"])
        motivacion = extract_field(block, FIELD_LABELS["motivacion"])
        causa = extract_field(block, FIELD_LABELS["causa_percibida"])
        objecion = extract_field(block, FIELD_LABELS["objeciones"])
        search = extract_field(block, FIELD_LABELS["search"])

        line = (
            f"### AGENT ID: {agent_id} — {nombre} ({arquetipo})\n"
            f"{situacion} Motivación: {motivacion} Cree que: {causa} "
            f"Objeción principal: {objecion} Búsqueda en Google: {search}\n"
        )
        entries.append(line)

    header = (
        "# Elenco de personas (version liviana para construcción de grafo)\n\n"
        f"Versión resumida de {len(entries)} identidades -- ver el archivo completo "
        "para el detalle de los 30+ campos por persona. Cada identidad conserva "
        "nombre, arquetipo, situación, motivación, creencia, objeción principal y "
        "búsqueda inicial en Google, suficiente para que MiroFish la reconozca como "
        "una entidad distinta sin generar cientos de fragmentos.\n\n"
    )
    return header + "\n".join(entries), len(ids)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", help="Archivo completo de personas")
    parser.add_argument("-o", "--output", help="Archivo de salida (default: <source>_liviano.md)")
    args = parser.parse_args()

    source_path = Path(args.source)
    if not source_path.exists():
        print(f"No existe: {source_path}", file=sys.stderr)
        return 1

    output_path = Path(args.output) if args.output else source_path.with_name(
        source_path.stem + "_liviano" + source_path.suffix
    )

    condensed, count = condense(source_path.read_text(encoding="utf-8"))
    output_path.write_text(condensed, encoding="utf-8")

    original_size = source_path.stat().st_size
    new_size = output_path.stat().st_size
    print(f"{count} identidades condensadas.")
    print(f"Original: {original_size:,} bytes -> Liviano: {new_size:,} bytes "
          f"({new_size / original_size:.0%})")
    print(f"Guardado en: {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
