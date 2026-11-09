"""Локальный анализатор текста: интерфейс Gradio над Python-функцией."""
# МОДУЛЬ PYTHON: re находит слова в тексте.
import re
from collections import Counter
# GRADIO: эта библиотека создаст интерфейс в браузере и свяжет его с функцией Python.
import gradio as gr

APP_TITLE = "Текстоскоп — Gradio"
TOP_N = 3  # Практика: попробуйте заменить 3 на 5


# ФУНКЦИЯ НА PYTHON: обрабатывает текст и возвращает четыре результата.
# Именно её Gradio вызовет при взаимодействии с интерфейсом.
def analyze(text: str):
    words = re.findall(r"[^\W\d_]+", text.lower(), flags=re.UNICODE)
    counts = Counter(words)
    most_common = sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:TOP_N]
    summary = "\n".join(f"{word}: {n}" for word, n in most_common)
    return len(words), len(text), len(counts), summary or "Нет слов для анализа"


# ОПИСАНИЕ ВЕБ-ИНТЕРФЕЙСА (Python-код, а не HTML):
# fn= — какая функция вызывается; inputs= — поле ввода; outputs= — поля результатов.
demo = gr.Interface(
    fn=analyze,
    inputs=gr.Textbox(label="Введите текст", lines=8, placeholder="Кот и пёс. Кот спит!"),
    outputs=[
        gr.Number(label="Слов"),
        gr.Number(label="Символов"),
        gr.Number(label="Уникальных слов"),
        gr.Textbox(label="Самые частые слова", lines=4),
    ],
    title=APP_TITLE,
    description="Все вычисления выполняет локальный Python-процесс. Никаких внешних API.",
    examples=[["Кот и пёс. Кот спит!"], ["Привет, мир. Привет!"]],
)

# ЗАПУСК: создаём локальный сервер, открываем интерфейс в браузере.
# Веб-интерфейс НЕ означает, что функция analyze работает внутри браузера.
if __name__ == "__main__":
    demo.launch(server_name="127.0.0.1", server_port=7860, share=False, inbrowser=True)
