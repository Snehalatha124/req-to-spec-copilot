try:
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage, SystemMessage
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False
    print("Warning: langchain_openai not installed. Using mock responses.")

import json
import os
from typing import Dict, Any, Optional

# Initialize LLM - using OpenAI by default, but can be configured
# For HuggingFace Spaces, you might want to use HuggingFace models
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Use ChatOpenAI for better results
if LANGCHAIN_AVAILABLE and OPENAI_API_KEY:
    try:
        llm = ChatOpenAI(temperature=0.7, model="gpt-3.5-turbo", api_key=OPENAI_API_KEY)
    except Exception as e:
        print(f"Warning: Could not initialize OpenAI LLM: {e}. Using mock responses.")
        llm = None
else:
    # Fallback to a mock or HuggingFace model
    # For production, configure with HuggingFace or other providers
    if not OPENAI_API_KEY:
        print("Warning: OPENAI_API_KEY not set. Using mock responses.")
    llm = None

async def generate_specification(requirement_text: str) -> Dict[str, Any]:
    """
    Generate specification using 3-step LangChain pipeline
    """
    if not llm:
        # Return mock data for testing without API key
        return get_mock_specification()
    
    # STEP 1: Extract Modules/Features
    modules = await extract_modules(requirement_text)
    
    # STEP 2: Generate User Stories
    user_stories = await generate_user_stories(requirement_text, modules)
    
    # STEP 3: Generate API + DB + Edge Cases
    api_db_edge = await generate_api_db_edge_cases(requirement_text, modules)
    
    return {
        "modules": modules,
        "user_stories": user_stories,
        "api_endpoints": api_db_edge.get("api_endpoints", []),
        "db_schema": api_db_edge.get("db_schema", []),
        "edge_cases": api_db_edge.get("edge_cases", [])
    }

async def extract_modules(requirement_text: str) -> list:
    """Step 1: Extract high-level modules/features"""
    if not llm:
        return get_mock_specification()["modules"]
    
    prompt = f"""Extract the high-level modules/features from the following requirement text.
Return a JSON array of objects, where each object has:
- "name": module/feature name
- "description": brief description

Requirement text:
{requirement_text}

Return only valid JSON array, no markdown formatting."""
    
    messages = [
        SystemMessage(content="You are a software architect. Extract modules and features from requirements. Always return valid JSON."),
        HumanMessage(content=prompt)
    ]
    
    response = llm(messages)
    content = response.content.strip()
    
    # Clean up markdown code blocks if present
    if content.startswith("```json"):
        content = content[7:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    
    try:
        modules = json.loads(content)
        if isinstance(modules, list):
            return modules
        return [modules] if isinstance(modules, dict) else []
    except json.JSONDecodeError:
        # Fallback parsing
        return [{"name": "Module 1", "description": "Extracted from requirements"}]

async def generate_user_stories(requirement_text: str, modules: list) -> list:
    """Step 2: Generate detailed user stories"""
    if not llm:
        return get_mock_specification()["user_stories"]
    
    modules_text = json.dumps(modules, indent=2)
    
    prompt = f"""Generate detailed user stories for each module using standard user story format.
Each user story should have:
- "module": module name it belongs to
- "story": user story in format "As a [role], I want [feature] so that [benefit]"
- "acceptance_criteria": array of acceptance criteria

Modules:
{modules_text}

Requirement text:
{requirement_text}

Return only valid JSON array of user stories, no markdown formatting."""
    
    messages = [
        SystemMessage(content="You are a product manager. Generate user stories following standard format. Always return valid JSON."),
        HumanMessage(content=prompt)
    ]
    
    response = llm(messages)
    content = response.content.strip()
    
    # Clean up markdown code blocks
    if content.startswith("```json"):
        content = content[7:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    
    try:
        stories = json.loads(content)
        return stories if isinstance(stories, list) else []
    except json.JSONDecodeError:
        return []

async def generate_api_db_edge_cases(requirement_text: str, modules: list) -> Dict[str, Any]:
    """Step 3: Generate API endpoints, DB schema, and edge cases"""
    if not llm:
        mock = get_mock_specification()
        return {
            "api_endpoints": mock["api_endpoints"],
            "db_schema": mock["db_schema"],
            "edge_cases": mock["edge_cases"]
        }
    
    modules_text = json.dumps(modules, indent=2)
    
    prompt = f"""Generate production-level API endpoints, DB schema, and edge cases for each module.

For API endpoints, include:
- "endpoint": URL path
- "method": HTTP method
- "description": what it does
- "request_schema": JSON schema for request body
- "response_schema": JSON schema for response body
- "module": module name

For DB schema, include:
- "table_name": name of table
- "columns": array of {column_name, data_type, constraints, description}
- "module": module name

For edge cases, include:
- "module": module name
- "scenario": description of edge case
- "handling": how to handle it

Modules:
{modules_text}

Requirement text:
{requirement_text}

Return only valid JSON object with keys: "api_endpoints", "db_schema", "edge_cases", no markdown formatting."""
    
    messages = [
        SystemMessage(content="You are a senior backend engineer. Generate production-ready API specs, database schemas, and edge cases. Always return valid JSON."),
        HumanMessage(content=prompt)
    ]
    
    response = llm(messages)
    content = response.content.strip()
    
    # Clean up markdown code blocks
    if content.startswith("```json"):
        content = content[7:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    
    try:
        result = json.loads(content)
        return {
            "api_endpoints": result.get("api_endpoints", []),
            "db_schema": result.get("db_schema", []),
            "edge_cases": result.get("edge_cases", [])
        }
    except json.JSONDecodeError:
        return {
            "api_endpoints": [],
            "db_schema": [],
            "edge_cases": []
        }

async def refine_specification(
    requirement_text: str,
    refinement_instructions: str,
    previous_spec: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Refine an existing specification with additional instructions"""
    if not llm or not LANGCHAIN_AVAILABLE:
        return get_mock_specification()
    
    previous_spec_text = json.dumps(previous_spec, indent=2) if previous_spec else "None"
    
    prompt = f"""Refine the following specification based on the refinement instructions.

Original requirement:
{requirement_text}

Previous specification:
{previous_spec_text}

Refinement instructions:
{refinement_instructions}

Update the specification (modules, user_stories, api_endpoints, db_schema, edge_cases) according to the refinement instructions.
Return only valid JSON object with keys: "modules", "user_stories", "api_endpoints", "db_schema", "edge_cases", no markdown formatting."""
    
    messages = [
        SystemMessage(content="You are a software architect refining specifications. Always return valid JSON."),
        HumanMessage(content=prompt)
    ]
    
    response = llm(messages)
    content = response.content.strip()
    
    # Clean up markdown code blocks
    if content.startswith("```json"):
        content = content[7:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return get_mock_specification()

def get_mock_specification() -> Dict[str, Any]:
    """Return mock specification for testing"""
    return {
        "modules": [
            {
                "name": "User Management",
                "description": "Handles user registration, authentication, and profile management"
            }
        ],
        "user_stories": [
            {
                "module": "User Management",
                "story": "As a user, I want to register an account so that I can access the system",
                "acceptance_criteria": [
                    "User can provide email and password",
                    "System validates email format",
                    "System stores user securely"
                ]
            }
        ],
        "api_endpoints": [
            {
                "endpoint": "/api/users/register",
                "method": "POST",
                "description": "Register a new user",
                "request_schema": {
                    "email": "string",
                    "password": "string"
                },
                "response_schema": {
                    "user_id": "integer",
                    "email": "string"
                },
                "module": "User Management"
            }
        ],
        "db_schema": [
            {
                "table_name": "users",
                "columns": [
                    {
                        "column_name": "id",
                        "data_type": "INTEGER",
                        "constraints": "PRIMARY KEY",
                        "description": "User ID"
                    },
                    {
                        "column_name": "email",
                        "data_type": "VARCHAR(255)",
                        "constraints": "UNIQUE NOT NULL",
                        "description": "User email"
                    }
                ],
                "module": "User Management"
            }
        ],
        "edge_cases": [
            {
                "module": "User Management",
                "scenario": "User tries to register with existing email",
                "handling": "Return 400 error with message 'Email already exists'"
            }
        ]
    }

