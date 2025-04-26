def give_prompt_template():
    return """
        You are creating quiz questions based on the text.

        CONTENT:
        {text}

        INSTRUCTIONS:
        - Create 1-2, short multiple-choice questions only
        - KEEP UNDER 200 TOKENS total response
        - Brief and focused questions
        - 4 answer options (A-D)
        - Only ONE option correct
        - Mark correct answer

        FORMAT:
        Question: [Question text]
        A. [Option A]
        B. [Option B]
        C. [Option C]
        D. [Option D]

        Correct Answer: [Letter]
        """


def get_refine_template():
    return """
        You are improving a quiz question.

        ORIGINAL:
        {existing_answer}

        NEW CONTEXT:
        {text}

        INSTRUCTIONS:
        - KEEP RESPONSE UNDER 200 TOKENS
        - Improve or add 1 question
        - Brief and clear
        - 4 options (A-D)
        - ONE correct answer

        FORMAT:
        Question: [Question text]
        A. [Option A]
        B. [Option B]
        C. [Option C]
        D. [Option D]

        Correct Answer: [Letter]
        """