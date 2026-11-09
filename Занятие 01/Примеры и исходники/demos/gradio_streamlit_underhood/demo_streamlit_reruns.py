"""Мини-демонстрация: Streamlit повторно выполняет скрипт при вводе."""
from datetime import datetime
import streamlit as st

print("[Python] Streamlit запустил скрипт:", datetime.now().strftime("%H:%M:%S.%f")[:-3], flush=True)

st.title("Streamlit: виджет → повторный запуск")
st.caption("Изменяйте поле ввода и смотрите на терминал с запущенным Streamlit.")
text = st.text_input("Введите текст", value="Привет")
st.write("Символов:", len(text))

if "clicks" not in st.session_state:
    st.session_state.clicks = 0

if st.button("Добавить к счётчику"):
    st.session_state.clicks += 1

st.metric("Нажатий, сохранённых в Session State", st.session_state.clicks)
st.caption("Без st.session_state обычная переменная clicks=0 создавалась бы заново при каждом запуске скрипта.")
