"""Однократно обучает модель цифр и сохраняет её для Gradio."""
from pathlib import Path
import joblib
from sklearn.datasets import load_digits
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent
X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=3000, random_state=42))
model.fit(X_train, y_train)
print(f"Точность на отложенной выборке: {model.score(X_test, y_test):.1%}")
joblib.dump(model, ROOT / "digits_model.joblib")
print("Модель сохранена в digits_model.joblib")
