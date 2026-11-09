"""Gradio: браузер отправляет изображение Python-функции с ML-моделью."""
from pathlib import Path
import gradio as gr
import joblib
import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
model = joblib.load(ROOT / "digits_model.joblib")  # Обученные веса уже лежат на диске.


def predict_digit(image: Image.Image, invert: bool):
    """Обработка картинки → модель → вероятности цифр от 0 до 9."""
    if image is None:
        raise gr.Error("Загрузите картинку с цифрой или выберите пример ниже.")
    gray = image.convert("L")
    if invert:  # В обучающем наборе цифры светлые на тёмном фоне.
        gray = ImageOps.invert(gray)
    small = gray.resize((8, 8), Image.Resampling.LANCZOS)
    features = np.asarray(small, dtype=np.float32).reshape(1, 64) / 255.0 * 16.0
    probabilities = model.predict_proba(features)[0]
    labels = {str(i): float(probabilities[i]) for i in range(10)}
    best = int(np.argmax(probabilities))
    preview = small.resize((240, 240), Image.Resampling.NEAREST)
    explanation = f"Распознана цифра {best}; уверенность модели: {probabilities[best]:.1%}. Модель работает в Python, интерфейс — в браузере."
    return labels, preview, explanation


with gr.Blocks(title="Распознавание цифр — Gradio") as demo:
    gr.Markdown("# Распознавание рукописных цифр")
    gr.Markdown("Выберите пример изображения. Gradio передаст его Python-функции, которая вызовет уже обученную модель.")
    with gr.Row():
        with gr.Column():
            image = gr.Image(label="Изображение цифры", type="pil", image_mode="L")
            invert = gr.Checkbox(label="Инвертировать светлое / тёмное", value=False)
            predict_button = gr.Button("Распознать", variant="primary")
        with gr.Column():
            predictions = gr.Label(label="Вероятности 10 классов", num_top_classes=5)
            preview = gr.Image(label="Что увидела модель: 8 × 8", interactive=False)
            explanation = gr.Textbox(label="Результат", interactive=False)
    # Один обработчик получает два значения и возвращает три результата.
    predict_button.click(
        fn=predict_digit,
        inputs=[image, invert],
        outputs=[predictions, preview, explanation],
    )
    examples = [[str(path), False] for path in sorted((ROOT / "examples").glob("*.png"))]
    gr.Examples(examples=examples, inputs=[image, invert], label="Образцы цифр")

if __name__ == "__main__":
    demo.launch(inbrowser=True, server_name="127.0.0.1", server_port=7862)
