"""API для сравнения обычного fetch, debounce и отмены запроса."""

import asyncio
import json
from pathlib import Path

from fastapi import FastAPI, Query

app = FastAPI(title="Лаборатория оптимизации · учебный API")
data_file = Path(__file__).resolve().parents[2] / 'catalog-shared' / 'data' / 'publications.json'
DATA = json.loads(data_file.read_text(encoding='utf-8'))


@app.get('/api/publications')
async def publications(q: str = '', delay_ms: int = Query(600, ge=0, le=3000)):
    await asyncio.sleep(delay_ms / 1000)
    normalized = q.casefold().strip()
    return [
        item for item in DATA
        if normalized in f"{item['title']} {item['authors']} {item['abstract']}".casefold()
    ]
