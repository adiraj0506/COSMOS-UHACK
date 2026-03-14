
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def evaluate_answer(question, answer):
    prompt = f"""
    Evaluate technical answer.

    Question: {question}
    Answer: {answer}

    Return:
    score,
    feedback,
    skill_level
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":prompt}]
    )

    return response.choices[0].message.content