from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import os
import hashlib
import secrets

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        # Format: salt:hash
        parts = hashed_password.split(':')
        if len(parts) != 2:
            return False
        salt, stored_hash = parts
        # Hash the password with the salt
        hash_obj = hashlib.sha256()
        hash_obj.update((plain_password + salt).encode('utf-8'))
        computed_hash = hash_obj.hexdigest()
        return secrets.compare_digest(computed_hash, stored_hash)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Hash a password"""
    # Generate a random salt
    salt = secrets.token_hex(16)
    # Hash password with salt
    hash_obj = hashlib.sha256()
    hash_obj.update((password + salt).encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    # Return salt:hash
    return f"{salt}:{password_hash}"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

