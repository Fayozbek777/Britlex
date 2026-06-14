import uuid
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    avatar = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password = generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.public_id,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "avatar": self.avatar,
        }


class SavedCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    card_number = db.Column(db.String(50), nullable=False)
    card_name = db.Column(db.String(100), nullable=False)
    card_expiry = db.Column(db.String(10), nullable=False)
    card_brand = db.Column(db.String(20), nullable=False)
    last4 = db.Column(db.String(4), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
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


class SavedWord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100), nullable=False)
    phonetic = db.Column(db.String(200))
    definition = db.Column(db.Text)
    example = db.Column(db.Text)
    audio_url = db.Column(db.String(500))
    translation_ru = db.Column(db.String(500))
    translation_uz = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
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
