import sys
import os
import re
import json

# Add the parent directory to sys.path to enable imports between sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import necessary libraries
from langchain_community.llms import CTransformers
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.prompts import PromptTemplate
from langchain.chains.llm import LLMChain

# Project imports
from file_loader.file_loading import file_loading
from prompt_templates.prompt_template import give_prompt_template

def load_model():
    return CTransformers(
        model='/home/omnai/Q_AND_A_Project/model_dev/model_logic/mistral-7b-instruct-v0.1.Q6_K.gguf',
        model_type='mistral',
        max_new_tokens=512,
        temperature=0.3,
        context_length=512,
    )

def making_chunk(path):
    text = file_loading(path)
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=50,
    )
    chunks = splitter.split_text(text)
    return [Document(page_content=chunk) for chunk in chunks]

def parse_mcq_output(mcq_text):
    try:
        question_match = re.search(r"Question:\s*(.*)", mcq_text, re.IGNORECASE)
        options = re.findall(r"([A-D])\.\s*(.*)", mcq_text)
        correct_match = re.search(r"Correct Answer:\s*([A-D])", mcq_text, re.IGNORECASE)

        if not (question_match and options and correct_match):
            return None

        question = question_match.group(1).strip()
        options_dict = {opt[0].lower(): opt[1].strip() for opt in options}
        correct_option = correct_match.group(1).lower()

        # Ensure all four options are present
        for letter in ['a', 'b', 'c', 'd']:
            options_dict.setdefault(letter, "(Missing Option)")

        return {
            "question": question,
            "options": options_dict,
            "correct_option": correct_option
        }
    except Exception as e:
        print(f"Error parsing MCQ: {e}")
        return None

def get_json_data(file_path):
    llm = load_model()
    prompt_template = give_prompt_template()
    prompt = PromptTemplate(template=prompt_template, input_variables=["text"])
    chain = LLMChain(llm=llm, prompt=prompt)

    documents = making_chunk(file_path)
    quiz = []

    max_quiz = 5

    for idx, doc in enumerate(documents):
        if len(quiz) >= max_quiz:
            break

        try:
            response = chain.invoke({"text": doc.page_content})
            mcq_text = response["text"] if isinstance(response, dict) else response
            parsed = parse_mcq_output(mcq_text)

            if parsed:
                quiz.append(parsed)
            else:
                print(f"Warning: Failed to parse MCQ from chunk {idx}")

        except Exception as e:
            print(f"Error generating MCQ from chunk {idx}: {str(e)}")
            continue

    return quiz
    # return json.dumps(quiz, indent=4)

if __name__ == "__main__":
    json_data = get_json_data('/home/omnai/Q_AND_A_Project/model_dev/file_loader/PDF_Store/test1.pdf')

    import json
    print(json.dumps(json_data, indent=4))

    # Quick sample print of each MCQ for confirmation
    for idx, mcq in enumerate(json_data):
        print(f"\nMCQ {idx+1}:")
        print(f"Q: {mcq['question']}")
        for opt, val in mcq['options'].items():
            print(f"{opt.upper()}. {val}")
        print(f"Correct Option: {mcq['correct_option'].upper()}")
