"""Мини-демонстрация: Gradio вызывает Python-функцию по событию пользователя."""
import gradio as gr


def count_chars(text: str) -> int:
    print(f"[Python] Gradio вызвал count_chars; длина = {len(text)}", flush=True)
    return len(text)


demo = gr.Interface(
    fn=count_chars,
    inputs=gr.Textbox(label="Введите текст", lines=3),
    outputs=gr.Number(label="Число символов"),
    title="Gradio: событие → Python-функция",
    description="После нажатия посмотрите в окно терминала, где запущен Python.",
)

if __name__ == "__main__":
    demo.launch(share=False, inbrowser=True)
