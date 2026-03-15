
import os

from openai import OpenAI

def evaluate_answer(question, answer):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return "OPENAI_API_KEY not configured. Set it to enable AI evaluation."

    client = OpenAI(api_key=api_key)
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
