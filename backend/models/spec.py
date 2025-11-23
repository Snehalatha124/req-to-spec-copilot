from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class SpecRequest(BaseModel):
    requirement_text: str

class SpecRefineRequest(BaseModel):
    requirement_text: str
    refinement_instructions: str
    previous_spec: Optional[Dict[str, Any]] = None

class SpecResponse(BaseModel):
    modules: List[Dict[str, Any]]
    user_stories: List[Dict[str, Any]]
    api_endpoints: List[Dict[str, Any]]
    db_schema: List[Dict[str, Any]]
    edge_cases: List[Dict[str, Any]]

