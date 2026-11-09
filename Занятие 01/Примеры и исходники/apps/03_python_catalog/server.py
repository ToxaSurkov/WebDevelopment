"""УЧЕБНЫЙ ПРИМЕР BACKEND — Python-сервер для каталога материалов.

ЭТО НЕ HTML И НЕ JAVASCRIPT. Это программа на языке Python.
Браузер не исполняет этот файл: он выполняется отдельно командой `python server.py`.

Что показать студентам:
1. server.py запускается как отдельный ПРОЦЕСС Python в терминале.
2. По адресу / сервер отдаёт браузеру HTML-файл index.html.
3. По адресу /api/items сервер читает items.json и возвращает JSON.
4. На странице JavaScript вызывает /api/items через fetch() и отображает ответ.

Локальный запуск: python server.py
Для учебной демонстрации в доверенной LAN: python server.py --host 0.0.0.0

ВНИМАНИЕ: нет аутентификации и HTTPS. НЕ публикуйте этот сервер в интернете.
"""

# import подключает готовые Python-модули из стандартной библиотеки.
from __future__ import annotations
import argparse  # Чтение параметров командной строки: --host, --port.
import json      # Чтение файла JSON и формирование JSON-ответа.
from pathlib import Path  # Работа с путями к файлам.
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer  # HTTP-сервер.
from urllib.parse import urlparse, parse_qs  # Разбор адреса и параметров запроса.

# ROOT — папка, где лежит именно этот server.py.
ROOT = Path(__file__).resolve().parent
PORT = 8765  # Порт, по которому браузер обращается к программе.


# class объявляет класс — описание объекта с его поведением.
# Здесь Handler определяет, как Python реагирует на HTTP-запросы.
class Handler(BaseHTTPRequestHandler):
    # do_GET(...) вызывается HTTP-сервером для запросов с методом GET.
    # self — текущий обработчик конкретного запроса.
    def do_GET(self):
        # Пример запроса: GET /api/items?q=отчёт HTTP/1.1
        path = urlparse(self.path)

        # МАРШРУТ 1: браузер запросил главную страницу /.
        if path.path == "/":
            body = (ROOT / "index.html").read_bytes()  # Читаем HTML из файла.
            self.send_response(200)  # HTTP 200 = запрос выполнен успешно.
            self.send_header("Content-Type", "text/html; charset=utf-8")

        # МАРШРУТ 2: браузер запросил данные приложения через API.
        elif path.path == "/api/items":
            # Считываем JSON-файл как данные Python — список словарей.
            items = json.loads((ROOT / "items.json").read_text(encoding="utf-8"))

            # Берём строку поиска из параметра q и приводим её к нижнему регистру.
            needle = parse_qs(path.query).get("q", [""])[0].casefold().strip()

            # Фильтрация: в ответ попадут только записи с нужным словом в названии.
            filtered = [item for item in items if needle in item["title"].casefold()]

            # Превращаем данные Python обратно в JSON для браузера.
            body = json.dumps(filtered, ensure_ascii=False, indent=2).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")

        # НЕИЗВЕСТНЫЙ МАРШРУТ: сообщаем, что ресурс не найден.
        else:
            body = b"Not Found"
            self.send_response(404)  # HTTP 404 = не найдено.
            self.send_header("Content-Type", "text/plain; charset=utf-8")

        # Завершаем HTTP-ответ: заголовки + содержимое, отправляемое браузеру.
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


# Этот блок запускается, только когда файл выполняют как отдельную программу.
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1", help="127.0.0.1 = свой ПК; 0.0.0.0 = все сетевые интерфейсы")
    parser.add_argument("--port", type=int, default=PORT)
    args = parser.parse_args()

    # ThreadingHTTPServer слушает входящие соединения и вызывает Handler.
    with ThreadingHTTPServer((args.host, args.port), Handler) as server:
        print(f"Open http://127.0.0.1:{args.port}/ on this computer")
        if args.host == "0.0.0.0":
            print("LAN MODE: on another device use http://<IP-OF-THIS-COMPUTER>:{}/".format(args.port))
            print("Use only on a trusted network; stop the server after the demo.")
        try:
            server.serve_forever()  # Сервер остаётся включённым, пока его не остановить.
        except KeyboardInterrupt:
            print("\nStopping server")  # Ctrl+C в терминале завершает пример.
