"""Только для лабораторной демонстрации fetch/debounce/AbortController.
Запуск из папки backend: python -m uvicorn main:app --reload --port 8000
CORS не нужен: Vite proxy пересылает /api к localhost:8000.
"""
import asyncio
import json
from pathlib import Path
from fastapi import FastAPI, Query

app = FastAPI(title="Svelte Performance Lab · учебный API")
DATA = json.loads((Path(__file__).resolve().parent.parent / 'src' / 'publications.json').read_text(encoding='utf-8'))

@app.get('/api/publications')
async def publications(q: str = '', delay_ms: int = Query(600, ge=0, le=3000)):
    await asyncio.sleep(delay_ms / 1000)
    normalized = q.casefold().strip()
    return [p for p in DATA if normalized in p['title'].casefold() or normalized in p['topic'].casefold()]
