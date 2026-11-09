"""Локальный анализатор текста: веб-интерфейс Streamlit."""
import re
from collections import Counter
# STREAMLIT: Python-библиотека, которая описывает интерфейс с помощью st.*.
import streamlit as st

APP_TITLE = "Текстоскоп — Streamlit"
TOP_N = 3  # Практика: попробуйте заменить 3 на 5


# Это обычная функция PYTHON для анализа текста.
def analyze(text: str):
    words = re.findall(r"[^\W\d_]+", text.lower(), flags=re.UNICODE)
    counts = Counter(words)
    common = sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:TOP_N]
    return {"words": len(words), "characters": len(text), "unique": len(counts), "top": common}


# ИНТЕРФЕЙС: st.title, st.text_area и st.button создают элементы веб-страницы.
# При взаимодействиях Streamlit обычно повторно выполняет скрипт сверху вниз.
st.set_page_config(page_title=APP_TITLE, page_icon="📄", layout="centered")
st.title(APP_TITLE)
st.caption("Локальный Python-сервер · браузер используется как интерфейс")
text = st.text_area("Введите текст", value="Кот и пёс. Кот спит!", height=180)
# Условие с кнопкой: блок ниже показывает результат после нажатия.
if st.button("Проанализировать", type="primary"):
    result = analyze(text)
    c1, c2, c3 = st.columns(3)
    c1.metric("Слов", result["words"])
    c2.metric("Символов", result["characters"])
    c3.metric("Уникальных", result["unique"])
    st.subheader("Частые слова")
    if result["top"]:
        for word, count in result["top"]:
            st.write(f"**{word}** — {count}")
    else:
        st.info("Нет слов для анализа")
