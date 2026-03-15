from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    cosmos_id = Column(String(32), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(32), nullable=False)

    password_hash = Column(String(512), nullable=False)
    password_salt = Column(String(64), nullable=False)

    company_name = Column(String(255), nullable=True)
    college_name = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    invite_code = Column(String(64), nullable=True)

    onboarding_complete = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_login_at = Column(DateTime, nullable=True)

    goal = relationship("UserGoal", back_populates="user", uselist=False)


class UserGoal(Base):
    __tablename__ = "user_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    goal = Column(String(255), nullable=False)
    category = Column(String(64), nullable=False)
    deadline = Column(Date, nullable=False)
    months = Column(Integer, nullable=False)
    weeks = Column(Integer, nullable=False)
    days = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="goal")


class RitResult(Base):
    __tablename__ = "rit_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    product_job = Column(Integer, nullable=False)
    research = Column(Integer, nullable=False)
    startup = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")
