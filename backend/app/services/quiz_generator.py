import json
import re
from app.core.llm import run_llm


def extract_json(text: str) -> dict:
    """
    Extract JSON object from LLM output safely
    """
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        return {}

    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return {}


def generate_mcq(subject: str, context: str) -> dict:
    prompt = f"""
Generate ONE multiple choice question (MCQ).

Subject: {subject}
Topic: {context}

Rules:
- Exactly 4 options
- One correct answer
- No explanation
- Output ONLY valid JSON

Format:
{{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct_answer": "A"
}}
"""

    response = run_llm(prompt)

    quiz = extract_json(response)

    # final validation
    if not quiz:
        return {}

    if (
        "question" not in quiz
        or "options" not in quiz
        or "correct_answer" not in quiz
        or len(quiz["options"]) != 4
    ):
        return {}

    return quiz
