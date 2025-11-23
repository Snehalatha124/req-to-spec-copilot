from fastapi import APIRouter, HTTPException, Depends
from backend.models.user import UserCreate, UserLogin
from backend.database.db import get_db
from backend.core.auth import verify_password, get_password_hash, create_access_token
import sqlite3

router = APIRouter()

@router.post("/signup")
async def signup(user_data: UserCreate):
    """Register a new user"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if user exists
            cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", 
                          (user_data.username, user_data.email))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="Username or email already exists")
            
            # Create user
            password_hash = get_password_hash(user_data.password)
            try:
                cursor.execute(
                    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                    (user_data.username, user_data.email, password_hash)
                )
                user_id = cursor.lastrowid
                conn.commit()
            except sqlite3.IntegrityError:
                raise HTTPException(status_code=400, detail="Username or email already exists")
            
            # Generate token
            access_token = create_access_token(data={"sub": user_data.username, "user_id": user_id})
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": user_id,
                    "username": user_data.username,
                    "email": user_data.email
                }
            }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Error in signup: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/login")
async def login(credentials: UserLogin):
    """Authenticate user and return JWT token"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, username, email, password_hash FROM users WHERE username = ?",
            (credentials.username,)
        )
        user = cursor.fetchone()
        
        if not user or not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        access_token = create_access_token(data={"sub": user["username"], "user_id": user["id"]})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"]
            }
        }

