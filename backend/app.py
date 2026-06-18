import os
import html
import requests
import jwt
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from functools import wraps
from models import db, User, SavedWord, SavedCard

app = Flask(__name__)

# Конфигурация
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "instance", "users.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your-secret-key-2025"

db.init_app(app)
bcrypt = Bcrypt(app)

# Настройка CORS
CORS(
    app,
    origins=["https://localhost:5173", "http://localhost:5173"],
    supports_credentials=True,
)

# Создание таблиц и админа
with app.app_context():
    # Удаляем старую БД и создаем новую
    db.drop_all()
    db.create_all()
    print("✅ Database recreated with role column!")

    # Создаем админа по умолчанию
    admin = User.query.filter_by(email="admin@britlex.uz").first()
    if not admin:
        admin = User(username="admin", email="admin@britlex.uz", role="admin")
        admin.set_password("admin123")
        db.session.add(admin)
        db.session.commit()
        print("✅ Admin created: admin@britlex.uz / admin123")

    print("✅ Database ready!")


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


# Декоратор проверки админа
def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role != "admin":
            return jsonify({"error": "Admin access required"}), 403
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
                    "role": user.role,
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

        new_user = User(username=data["username"], email=data["email"], role="student")
        new_user.set_password(data["password"])
        db.session.add(new_user)
        db.session.commit()

        token = jwt.encode(
            {
                "public_id": new_user.public_id,
                "role": new_user.role,
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


# Добавьте в app.py после других эндпоинтов:


# Получить всех учителей (только админ)
@app.route("/api/admin/teachers", methods=["GET", "OPTIONS"])
@token_required
@admin_required
def get_teachers(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    teachers = User.query.filter_by(role="teacher").all()
    return jsonify({"teachers": [teacher.to_dict() for teacher in teachers]}), 200


# Создать учителя (только админ)
@app.route("/api/admin/teachers", methods=["POST", "OPTIONS"])
@token_required
@admin_required
def create_teacher(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        phone = data.get("phone", "")

        if not username or not email or not password:
            return jsonify({"error": "Username, email and password required"}), 400

        # Проверка существующего пользователя
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already exists"}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username already exists"}), 400

        new_teacher = User(username=username, email=email, phone=phone, role="teacher")
        new_teacher.set_password(password)
        db.session.add(new_teacher)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Teacher created successfully",
                    "teacher": new_teacher.to_dict(),
                }
            ),
            201,
        )
    except Exception as e:
        print(f"Create teacher error: {e}")
        return jsonify({"error": str(e)}), 500


# Удалить учителя (только админ)
@app.route("/api/admin/teachers/<int:teacher_id>", methods=["DELETE", "OPTIONS"])
@token_required
@admin_required
def delete_teacher(current_user, teacher_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    teacher = User.query.filter_by(id=teacher_id, role="teacher").first()
    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404

    db.session.delete(teacher)
    db.session.commit()
    return jsonify({"message": "Teacher deleted"}), 200


# ========== TASK ENDPOINTS ==========


# Получить все задания (для всех пользователей)
@app.route("/api/tasks", methods=["GET", "OPTIONS"])
@token_required
def get_tasks(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify({"tasks": [task.to_dict() for task in tasks]}), 200


# Создать задание (только учитель или админ)
@app.route("/api/tasks", methods=["POST", "OPTIONS"])
@token_required
def create_task(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    # Проверка роли
    if current_user.role not in ["teacher", "admin"]:
        return jsonify({"error": "Only teachers and admins can create tasks"}), 403

    try:
        data = request.get_json()
        title = data.get("title")
        description = data.get("description", "")
        due_date = data.get("due_date")
        icon = data.get("icon", "📝")

        if not title or not due_date:
            return jsonify({"error": "Title and due date are required"}), 400

        new_task = Task(
            title=title,
            description=description,
            due_date=due_date,
            icon=icon,
            status="pending",
            created_by=current_user.id,
        )

        db.session.add(new_task)
        db.session.commit()

        return (
            jsonify(
                {"message": "Task created successfully", "task": new_task.to_dict()}
            ),
            201,
        )
    except Exception as e:
        print(f"Create task error: {e}")
        return jsonify({"error": str(e)}), 500


# Обновить статус задания (для всех пользователей)
@app.route("/api/tasks/<int:task_id>", methods=["PUT", "OPTIONS"])
@token_required
def update_task_status(current_user, task_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    try:
        data = request.get_json()
        status = data.get("status")

        if status not in ["pending", "in_progress", "done"]:
            return jsonify({"error": "Invalid status"}), 400

        task.status = status
        db.session.commit()

        return (
            jsonify({"message": "Task updated successfully", "task": task.to_dict()}),
            200,
        )
    except Exception as e:
        print(f"Update task error: {e}")
        return jsonify({"error": str(e)}), 500


# Удалить задание (только учитель или админ)
@app.route("/api/tasks/<int:task_id>", methods=["DELETE", "OPTIONS"])
@token_required
def delete_task(current_user, task_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    # Проверка роли
    if current_user.role not in ["teacher", "admin"]:
        return jsonify({"error": "Only teachers and admins can delete tasks"}), 403

    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully"}), 200


# Получить всех пользователей (только админ)
@app.route("/api/admin/users", methods=["GET", "OPTIONS"])
@token_required
@admin_required
def get_all_users(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    users = User.query.all()
    return jsonify({"users": [user.to_dict() for user in users]}), 200


# Получить статистику (только админ)
@app.route("/api/admin/stats", methods=["GET", "OPTIONS"])
@token_required
@admin_required
def get_stats(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    total_students = User.query.filter_by(role="student").count()
    total_words = SavedWord.query.count()
    total_cards = SavedCard.query.count()

    return (
        jsonify(
            {
                "total_students": total_students,
                "total_words": total_words,
                "total_cards": total_cards,
            }
        ),
        200,
    )


# Получить всех студентов (только админ)
# Получить всех студентов (только админ)
@app.route("/api/admin/students", methods=["GET", "OPTIONS"])
@token_required
@admin_required
def get_students(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    # Получаем всех пользователей с ролью student
    students = User.query.filter_by(role="student").all()

    # Добавляем дополнительную информацию (количество слов и карт)
    result = []
    for student in students:
        words_count = SavedWord.query.filter_by(user_id=student.id).count()
        cards_count = SavedCard.query.filter_by(user_id=student.id).count()

        student_dict = student.to_dict()
        student_dict["words_count"] = words_count
        student_dict["cards_count"] = cards_count
        result.append(student_dict)

    return jsonify({"students": result}), 200


# Удалить студента (только админ)
@app.route("/api/admin/students/<int:student_id>", methods=["DELETE", "OPTIONS"])
@token_required
@admin_required
def delete_student(current_user, student_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    student = User.query.filter_by(id=student_id, role="student").first()
    if not student:
        return jsonify({"error": "Student not found"}), 404

    db.session.delete(student)
    db.session.commit()
    return jsonify({"message": "Student deleted"}), 200


# Получить все слова всех пользователей (только админ)
@app.route("/api/admin/words", methods=["GET", "OPTIONS"])
@token_required
@admin_required
def get_all_words(current_user):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    words = SavedWord.query.all()
    return jsonify({"words": [word.to_dict() for word in words]}), 200


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


# Получить все слова
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


# Сохранить слово
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
