from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from backend.models.spec import SpecRequest, SpecRefineRequest, SpecResponse
from backend.database.db import get_db
from backend.core.auth import verify_token
from backend.langchain_pipeline.pipeline import generate_specification, refine_specification
import json

router = APIRouter()

def get_current_user(authorization: Optional[str] = Header(None)):
    """Dependency to get current authenticated user"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        token = authorization.split(" ")[1]  # Bearer <token>
    except IndexError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return payload

@router.post("/spec")
async def generate_spec(
    request: SpecRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate specification from requirement text"""
    try:
        result = await generate_specification(request.requirement_text)
        
        # Save to history
        user_id = current_user["user_id"]
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO requests (user_id, input_text, output_json, request_type) VALUES (?, ?, ?, ?)",
                (user_id, request.requirement_text, json.dumps(result), "generate")
            )
            conn.commit()
        
        return SpecResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating specification: {str(e)}")

@router.post("/refine/spec")
async def refine_spec(
    request: SpecRefineRequest,
    current_user: dict = Depends(get_current_user)
):
    """Refine an existing specification with additional instructions"""
    try:
        result = await refine_specification(
            request.requirement_text,
            request.refinement_instructions,
            request.previous_spec
        )
        
        # Save to history
        user_id = current_user["user_id"]
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO requests (user_id, input_text, output_json, request_type) VALUES (?, ?, ?, ?)",
                (user_id, f"{request.requirement_text}\n\nRefinement: {request.refinement_instructions}", 
                 json.dumps(result), "refine")
            )
            conn.commit()
        
        return SpecResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refining specification: {str(e)}")

@router.get("/history")
async def get_history(
    current_user: dict = Depends(get_current_user),
    limit: int = 10
):
    """Get user's request history"""
    user_id = current_user["user_id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """SELECT id, input_text, output_json, request_type, created_at 
               FROM requests 
               WHERE user_id = ? 
               ORDER BY created_at DESC 
               LIMIT ?""",
            (user_id, limit)
        )
        rows = cursor.fetchall()
        
        history = []
        for row in rows:
            history.append({
                "id": row["id"],
                "input_text": row["input_text"],
                "output_json": json.loads(row["output_json"]),
                "request_type": row["request_type"],
                "created_at": row["created_at"]
            })
        
        return {"history": history}

