from __future__ import annotations

import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DB_PATH = (BASE_DIR / ".." / "data" / "cosmos.db").resolve()

# Ensure the data directory exists for SQLite
DEFAULT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)

# Load env from apps/api/.env explicitly to avoid cwd issues
ENV_PATH = (BASE_DIR / ".." / ".env").resolve()
load_dotenv(ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = f"sqlite:///{DEFAULT_DB_PATH.as_posix()}"

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()


def init_db() -> None:
    import app.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
