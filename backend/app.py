import html
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешаем CORS-запросы с твоего React-приложения

# Берём токен и ID строго из твоего рабочего конфига
BOT_TOKEN = "8836968451:AAGRHpUr93XWl3acT_Kn6MTWHAba9U1V7Ag"
CHAT_ID = "7128905128"


@app.route("/api/telegram", methods=["POST"])
def send_telegram_message():
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"error": "Missing request body"}), 400

    name = html.escape(str(data.get("name", "")).strip())
    phone = html.escape(str(data.get("phone", "")).strip())

    if not name or not phone:
        return jsonify({"error": "Missing name or phone number"}), 400

    html_message = (
        f"<b>🔔 Новая заявка с сайта!</b>\n\n"
        f"<b>👤 Имя:</b> {name}\n"
        f"<b>📞 Телефон:</b> <code>{phone}</code>"
    )

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": html_message, "parse_mode": "HTML"}

    try:
        response = requests.post(url, json=payload, timeout=10)
        res_data = response.json()

        if response.status_code == 200 and res_data.get("ok"):
            return jsonify({"ok": True}), 200
        else:
            # Печатаем в консоль Python то, что ответил Telegram
            print(f"❌ Ошибка от Telegram API: {res_data}")
            return (
                jsonify({"error": res_data.get("description", "Telegram Error")}),
                502,
            )

    except Exception as e:
        print(f"❌ Системная ошибка Flask: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
