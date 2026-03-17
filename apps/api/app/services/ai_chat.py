from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def chat_with_ai(message: str):

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """
You are SARTHI, AI Digital Mentor of COSMOS.

Guide students in:

- skill improvement
- project suggestions
- roadmap planning
- interview preparation
- resume improvement
- career decision making

Keep answers practical and structured.
"""
            },
            {
                "role": "user",
                "content": message
            }
        ],
        temperature=0.7,
        max_tokens=800
    )

    return completion.choices[0].message.content
