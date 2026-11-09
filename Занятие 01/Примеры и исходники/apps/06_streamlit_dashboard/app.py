"""Учебная аналитическая панель Streamlit, без pandas и без внешних API."""
import csv
from pathlib import Path
from collections import defaultdict
# STREAMLIT: создаёт интерфейс и обновляет его после взаимодействия с виджетами.
import streamlit as st

st.set_page_config(page_title="Аналитическая панель", layout="centered")
st.title("Сводка по категориям")
st.caption("Один Python-скрипт задаёт таблицу, фильтр и график.")
# ДАННЫЕ: CSV — обычный файл с табличными записями.
with (Path(__file__).parent / "sample.csv").open(encoding="utf-8", newline="") as file:
    rows = list(csv.DictReader(file))
categories = sorted({row["Категория"] for row in rows})
# ВИДЖЕТ: пользователь выбирает категории в браузере.
selected = st.multiselect("Категории", categories, default=categories)
subset = [row for row in rows if row["Категория"] in selected]
# ЛОГИКА НА PYTHON: подсчитываем суммы для выбранных категорий.
summary = defaultdict(int)
for row in subset:
    summary[row["Категория"]] += int(row["Количество"])
st.subheader("Всего по категориям")
# ГРАФИК: Streamlit преобразует данные в визуальный элемент страницы.
st.bar_chart([{"Категория": key, "Количество": count} for key, count in summary.items()], x="Категория", y="Количество")
st.subheader("Исходные данные")
st.dataframe(subset, use_container_width=True)
st.caption("Попробуйте убрать категорию: Streamlit обновит страницу после взаимодействия с виджетом.")
