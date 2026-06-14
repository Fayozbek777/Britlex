import os
import html
import requests
import jwt
import datetime
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from functools import wraps

app = Flask(__name__)

# Конфигурация
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "instance", "users.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your-secret-key-2025"

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Настройка CORS
CORS(
    app,
    origins=["https://localhost:5173", "http://localhost:5173"],
    supports_credentials=True,
)


# Модель пользователя
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    avatar = db.Column(db.Text, nullable=True)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.public_id,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "avatar": self.avatar,
        }


# Модель сохраненных слов (исправленная)
class SavedWord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100), nullable=False)
    phonetic = db.Column(db.String(200))
    definition = db.Column(db.Text)
    example = db.Column(db.Text)
    audio_url = db.Column(db.String(500))
    translation_ru = db.Column(db.String(500))
    translation_uz = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "word": self.word,
            "phonetic": self.phonetic,
            "definition": self.definition,
            "example": self.example,
            "audio_url": self.audio_url,
            "translations": {
                "en": self.word,
                "ru": self.translation_ru,
                "uz": self.translation_uz,
            },
            "date": self.created_at.isoformat() if self.created_at else None,
        }


# Модель карт
class SavedCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    card_number = db.Column(db.String(50), nullable=False)
    card_name = db.Column(db.String(100), nullable=False)
    card_expiry = db.Column(db.String(10), nullable=False)
    card_brand = db.Column(db.String(20), nullable=False)
    last4 = db.Column(db.String(4), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "card_number": self.card_number,
            "card_name": self.card_name,
            "card_expiry": self.card_expiry,
            "card_brand": self.card_brand,
            "last4": self.last4,
        }


# Создание таблиц
with app.app_context():
    db.drop_all()
    db.create_all()
    print("✅ Database created!")


# Декоратор проверки токена
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        if token.startswith("Bearer "):
            token = token[7:]

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=data["public_id"]).first()
            if not current_user:
                return jsonify({"error": "User not found"}), 401
        except:
            return jsonify({"error": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# Логин
@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            token = jwt.encode(
                {
                    "public_id": user.public_id,
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
                },
                app.config["SECRET_KEY"],
                algorithm="HS256",
            )

            return (
                jsonify(
                    {
                        "message": "Login successful",
                        "token": token,
                        "user": user.to_dict(),
                    }
                ),
                200,
            )

        return jsonify({"message": "Invalid email or password"}), 401
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"message": str(e)}), 500


# Регистрация
@app.route("/api/register", methods=["POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data = request.get_json()

        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"message": "Email already exists"}), 400

        new_user = User(username=data["username"], email=data["email"])
        new_user.set_password(data["password"])
        db.session.add(new_user)
        db.session.commit()

        token = jwt.encode(
            {
                "public_id": new_user.public_id,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
            },
            app.config["SECRET_KEY"],
            algorithm="HS256",
        )

        return (
            jsonify(
                {
                    "message": "Registration successful",
                    "token": token,
                    "user": new_user.to_dict(),
                }
            ),
            201,
        )
    except Exception as e:
        print(f"Register error: {e}")
        return jsonify({"message": str(e)}), 500


# Получить профиль
@app.route("/api/profile", methods=["GET", "OPTIONS"])
@token_required
def get_profile(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    return jsonify({"user": current_user.to_dict()}), 200


# Обновить профиль
@app.route("/api/profile", methods=["PUT", "OPTIONS"])
@token_required
def update_profile(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data = request.get_json()

        if "username" in data:
            existing = User.query.filter(
                User.username == data["username"], User.id != current_user.id
            ).first()
            if existing:
                return jsonify({"error": "Username already exists"}), 400
            current_user.username = data["username"]

        if "email" in data:
            existing = User.query.filter(
                User.email == data["email"], User.id != current_user.id
            ).first()
            if existing:
                return jsonify({"error": "Email already exists"}), 400
            current_user.email = data["email"]

        if "phone" in data:
            current_user.phone = data["phone"]

        if "avatar" in data:
            current_user.avatar = data["avatar"]

        db.session.commit()

        return (
            jsonify({"message": "Profile updated", "user": current_user.to_dict()}),
            200,
        )
    except Exception as e:
        print(f"Update profile error: {e}")
        return jsonify({"error": str(e)}), 500


# Сменить пароль
@app.route("/api/change-password", methods=["POST", "OPTIONS"])
@token_required
def change_password(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data = request.get_json()
        current_password = data.get("currentPassword")
        new_password = data.get("newPassword")

        if not current_user.check_password(current_password):
            return jsonify({"error": "Current password is incorrect"}), 401

        if len(new_password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        current_user.set_password(new_password)
        db.session.commit()

        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        print(f"Change password error: {e}")
        return jsonify({"error": str(e)}), 500


# Получить все слова (исправленный)
@app.route("/api/dictionary", methods=["GET", "OPTIONS"])
@token_required
def get_dictionary(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    words = (
        SavedWord.query.filter_by(user_id=current_user.id)
        .order_by(SavedWord.created_at.desc())
        .all()
    )
    return jsonify({"words": [word.to_dict() for word in words]}), 200


# Сохранить слово (исправленный)
@app.route("/api/dictionary", methods=["POST", "OPTIONS"])
@token_required
def save_word(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data = request.get_json()

        existing = SavedWord.query.filter_by(
            user_id=current_user.id, word=data.get("word")
        ).first()
        if existing:
            return jsonify({"error": "Word already saved"}), 400

        new_word = SavedWord(
            word=data.get("word"),
            phonetic=data.get("phonetic", ""),
            definition=data.get("definition", ""),
            example=data.get("example", ""),
            audio_url=data.get("audio_url", ""),
            translation_ru=data.get("translations", {}).get("ru", ""),
            translation_uz=data.get("translations", {}).get("uz", ""),
            user_id=current_user.id,
        )

        db.session.add(new_word)
        db.session.commit()

        return jsonify({"message": "Word saved", "word": new_word.to_dict()}), 201
    except Exception as e:
        print(f"Save word error: {e}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Удалить слово
@app.route("/api/dictionary/<int:word_id>", methods=["DELETE", "OPTIONS"])
@token_required
def delete_word(current_user, word_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    word = SavedWord.query.filter_by(id=word_id, user_id=current_user.id).first()
    if not word:
        return jsonify({"error": "Word not found"}), 404

    db.session.delete(word)
    db.session.commit()
    return jsonify({"message": "Word deleted"}), 200


# Очистить словарь
@app.route("/api/dictionary/clear", methods=["DELETE", "OPTIONS"])
@token_required
def clear_dictionary(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    SavedWord.query.filter_by(user_id=current_user.id).delete()
    db.session.commit()
    return jsonify({"message": "All words cleared"}), 200


# Получить карты
@app.route("/api/cards", methods=["GET", "OPTIONS"])
@token_required
def get_cards(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    cards = SavedCard.query.filter_by(user_id=current_user.id).all()
    return jsonify({"cards": [card.to_dict() for card in cards]}), 200


# Добавить карту
@app.route("/api/cards", methods=["POST", "OPTIONS"])
@token_required
def add_card(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data = request.get_json()

        new_card = SavedCard(
            card_number=data["card_number"],
            card_name=data["card_name"],
            card_expiry=data["card_expiry"],
            card_brand=data["card_brand"],
            last4=data["last4"],
            user_id=current_user.id,
        )

        db.session.add(new_card)
        db.session.commit()

        return jsonify({"message": "Card added", "card": new_card.to_dict()}), 201
    except Exception as e:
        print(f"Add card error: {e}")
        return jsonify({"error": str(e)}), 500


# Удалить карту
@app.route("/api/cards/<int:card_id>", methods=["DELETE", "OPTIONS"])
@token_required
def delete_card(current_user, card_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    card = SavedCard.query.filter_by(id=card_id, user_id=current_user.id).first()
    if not card:
        return jsonify({"error": "Card not found"}), 404

    db.session.delete(card)
    db.session.commit()
    return jsonify({"message": "Card deleted"}), 200


# Telegram
@app.route("/api/telegram", methods=["POST", "OPTIONS"])
def send_telegram_message():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data = request.get_json()
        name = html.escape(str(data.get("name", "")))
        phone = html.escape(str(data.get("phone", "")))

        url = "https://api.telegram.org/bot8836968451:AAGRHpUr93XWl3acT_Kn6MTWHAba9U1V7Ag/sendMessage"
        payload = {
            "chat_id": "7128905128",
            "text": f"🔔 New request!\nName: {name}\nPhone: {phone}",
            "parse_mode": "HTML",
        }

        requests.post(url, json=payload, timeout=10)
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
