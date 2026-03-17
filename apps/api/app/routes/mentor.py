from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/api/mentor",
    tags=["Mentor"]
)

groq_api_key = os.getenv("GROQ_API_KEY")

if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")

client = Groq(api_key=groq_api_key)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


SYSTEM_PROMPT = """
You are SARTHI, AI Digital Mentor of COSMOS.

You help learners with:

- Skill improvement
- Roadmap planning
- Project suggestions
- Interview preparation
- Resume strengthening
- Career decisions

Rules:
- Give structured answers
- Be practical
- Give step-by-step suggestions
- Keep response premium and mentor-like
"""


@router.post("/chat", response_model=ChatResponse)
async def mentor_chat(req: ChatRequest):
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": req.message
                }
            ],
            temperature=0.7,
            max_tokens=900
        )

        reply = completion.choices[0].message.content.strip()

        return ChatResponse(response=reply)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Groq API Error: {str(e)}"
        )

