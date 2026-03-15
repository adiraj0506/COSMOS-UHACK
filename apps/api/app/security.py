from __future__ import annotations

import hashlib
import hmac
import os


def hash_password(password: str) -> tuple[str, str]:
    salt = os.urandom(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return hashed.hex(), salt.hex()


def verify_password(password: str, stored_hash: str, stored_salt: str) -> bool:
    salt = bytes.fromhex(stored_salt)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000).hex()
    return hmac.compare_digest(hashed, stored_hash)
