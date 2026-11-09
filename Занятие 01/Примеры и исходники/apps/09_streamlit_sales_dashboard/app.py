"""Streamlit: панель продаж с интерактивными фильтрами и диаграммами."""
from pathlib import Path
import pandas as pd
import streamlit as st

ROOT = Path(__file__).resolve().parent
st.set_page_config(page_title="Продажи — Streamlit", layout="wide")
st.title("Аналитическая панель продаж")


@st.cache_data  # При повторных запусках кэшируем чтение одного и того же CSV.
def load_data():
    return pd.read_csv(
        ROOT / "sales.csv", parse_dates=["date"]
    )


df = load_data()
st.sidebar.header("Фильтры")
regions = st.sidebar.multiselect(
    "Регион", sorted(df["region"].unique()),
    default=sorted(df["region"].unique()),
)
channels = st.sidebar.multiselect("Канал", sorted(df["channel"].unique()), default=sorted(df["channel"].unique()))
products = st.sidebar.multiselect("Товар", sorted(df["product"].unique()), default=sorted(df["product"].unique()))
date_range = st.sidebar.date_input("Период", value=(df["date"].min().date(), df["date"].max().date()))

# При любом изменении фильтра Streamlit по умолчанию выполнит скрипт заново.
filtered = df[
    df["region"].isin(regions)
    & df["channel"].isin(channels)
    & df["product"].isin(products)
]
if len(date_range) == 2:
    start, end = map(pd.Timestamp, date_range)
    filtered = filtered[filtered["date"].between(start, end)]

if filtered.empty:
    st.warning("По выбранным фильтрам данных нет. Измените параметры слева.")
    st.stop()

revenue = filtered["revenue"].sum()
profit = (filtered["revenue"] - filtered["cost"]).sum()
cols = st.columns(4)
cols[0].metric("Выручка", f"{revenue:,.0f} ₽")
cols[1].metric("Прибыль", f"{profit:,.0f} ₽")
cols[2].metric("Маржа", f"{profit / revenue:.1%}" if revenue else "—")
cols[3].metric("Продано единиц", f"{filtered['units'].sum():,.0f}")

left, right = st.columns(2)
with left:
    st.subheader("Выручка по дням")
    daily = filtered.groupby("date", as_index=True)["revenue"].sum()
    st.line_chart(daily)
with right:
    st.subheader("Выручка по регионам")
    by_region = filtered.groupby("region", as_index=True)["revenue"].sum().sort_values(ascending=False)
    st.bar_chart(by_region)

st.subheader("Товары: суммарные показатели")
summary = filtered.groupby("product").agg(orders=("revenue", "size"), units=("units", "sum"), revenue=("revenue", "sum"))
st.dataframe(summary.sort_values("revenue", ascending=False), use_container_width=True)
st.download_button("Скачать выбранные строки (CSV)", data=filtered.to_csv(index=False).encode("utf-8-sig"), file_name="filtered_sales.csv", mime="text/csv")
