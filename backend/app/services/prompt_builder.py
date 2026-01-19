def build_teaching_prompt(
    subject: str,
    user_question: str,
    pdf_context: list[str] | None = None,
    weak_concepts: list[dict] | None = None
) -> str:
    prompt = f"You are an AI tutor.\n\nSubject: {subject}\n\n"

    if weak_concepts:
        prompt += (
            "The student is weak in the following related concepts:\n"
        )
        for w in weak_concepts:
            prompt += f"- {w['concept']} (accuracy {w['accuracy']}%)\n"

        prompt += (
            "\nTeach slowly, use simple language, "
            "and include a small example.\n\n"
        )

    if pdf_context:
        prompt += "Reference material:\n"
        prompt += pdf_context[0] + "\n\n"

    prompt += f"Question:\n{user_question}\n\nAnswer:\n"

    return prompt
