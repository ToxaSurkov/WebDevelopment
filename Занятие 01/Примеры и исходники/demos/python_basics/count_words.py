"""Простейший Python-пример для слайда 18. Запуск: python count_words.py"""


def count_words(text):
    return len(text.split())


print(count_words("Кот спит"))
