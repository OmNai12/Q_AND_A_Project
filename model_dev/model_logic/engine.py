import sys
import os

# Add the parent directory to sys.path to enable imports between sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import necessary libraries
from langchain_community.llms import CTransformers
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS

# Project imports
from file_loader.file_loading import file_loading
from prompt_templates.prompt_template import give_prompt_template, get_refine_template

def load_model():
    """
    Load the model from the specified path.
    Returns:
        CTransformers: The loaded model.
    """
    llm = CTransformers(
        model='/home/omnai/Q_AND_A_Project/model_dev/model_logic/mistral-7b-instruct-v0.1.Q6_K.gguf',
        model_type='mistral',
        max_new_tokens=256,  # Reduced to avoid token limit issues
        temperature=0.2,
        # Explicitly set context length to model's limit
        context_length=512,
    )
    return llm

def making_chunk(path):
    """
    Preprocess the given text.

    Args:
        text (str): The text to be preprocessed.

    Returns:
        str: The preprocessed text.
    """

    text = file_loading(path)

    # Much smaller chunks to avoid token limit issues
    question_splitter = RecursiveCharacterTextSplitter(
        chunk_size=250,  # Reduced from 1000
        chunk_overlap=50,  # Reduced from 200
    )

    # The text comes from the pdf file
    chunk_questions = question_splitter.split_text(text)
    document_questions = [Document(page_content=chunk) for chunk in chunk_questions]

    answers_splitter = RecursiveCharacterTextSplitter(
        chunk_size=200,  # Reduced from 700
        chunk_overlap=25,  # Reduced from 75
    )

    chunk_answers = answers_splitter.split_documents(document_questions)

    return document_questions, chunk_answers

def process_generated_questions(raw_questions):
    """
    Process raw question output into properly formatted questions.
    
    Args:
        raw_questions (str): Raw output from the model.
        
    Returns:
        list: List of properly formatted questions.
    """
    import re
    
    # First try to extract proper questions with question marks
    questions = []
    lines = raw_questions.split('\n')
    
    for line in lines:
        # Look for lines that contain a question mark and don't start with options
        if '?' in line and not line.strip().startswith(('A.', 'B.', 'C.', 'D.')):
            # Extract just the question part (ending with a question mark)
            question_match = re.search(r'(.*?\?)', line)
            if question_match:
                # Remove "Question:" prefix if it exists
                question_text = question_match.group(1).strip()
                if question_text.startswith('Question:'):
                    question_text = question_text[9:].strip()
                questions.append(question_text)
    
    # If no questions found, try to find lines that look like questions
    if not questions:
        for line in lines:
            if any(word in line.lower() for word in ['what', 'who', 'when', 'where', 'why', 'how']):
                # Remove "Question:" prefix if it exists
                question_text = line.strip()
                if question_text.startswith('Question:'):
                    question_text = question_text[9:].strip()
                questions.append(question_text)
    
    # Remove duplicate questions
    unique_questions = []
    for q in questions:
        if q not in unique_questions:
            unique_questions.append(q)
    
    return unique_questions

def llm_pipline(file_path):
    """
    Run the LLM pipeline.
    """

    document_questions, chunk_answers = making_chunk(file_path)
    llm_question_geration_pipline = load_model()
    print("LLM loaded successfully")

    # Get prompt templates
    question_prompt_template = give_prompt_template()
    refine_prompt_template = get_refine_template()
    
    # Create prompt templates with minimal variables
    question_prompt = PromptTemplate(
        template=question_prompt_template,
        input_variables=["text"]
    )
    
    refine_prompt = PromptTemplate(
        template=refine_prompt_template,
        input_variables=["existing_answer", "text"]
    )

    # Process one or a very small number of chunks at a time
    all_questions = ""
    
    # Process chunks in very small batches to stay within token limits
    batch_size = 1  # Process just one chunk at a time
    
    # Limit chunks to process so we don't get too many similar questions
    max_chunks_to_process = min(10, len(document_questions))
    
    for i in range(0, max_chunks_to_process, batch_size):
        batch = document_questions[i:i+batch_size]
        print(f"Processing batch {i//batch_size + 1}/{(max_chunks_to_process + batch_size - 1)//batch_size}")
        
        try:
            # Create summarization chain
            chain = load_summarize_chain(
                llm=llm_question_geration_pipline,
                chain_type="refine",
                verbose=True,
                question_prompt=question_prompt,
                refine_prompt=refine_prompt,
            )
            
            # Run the chain with minimal input
            batch_questions = chain.run(
                input_documents=batch
            )
            
            all_questions += batch_questions + "\n\n"
        except Exception as e:
            print(f"Error processing batch: {str(e)}")
            # Continue with next batch even if there's an error
            continue

    # Process the generated questions
    questions = process_generated_questions(all_questions)
    print("Questions generated successfully")
    print(questions)

    # Creating Embeddings
    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

    # Creating the vector store
    vector_store = FAISS.from_documents(chunk_answers, embeddings)

    # 
    llm_answer_generation_pipline = load_model()

    # Filter out anything that doesn't look like a question
    filtering_questions = [question for question in questions if question.endswith('?') or any(word in question.lower() for word in ['what', 'who', 'when', 'where', 'why', 'how'])]

    answer_genration_chain = RetrievalQA.from_chain_type(
        llm=llm_answer_generation_pipline,
        chain_type="stuff",
        retriever=vector_store.as_retriever(),
    )

    return answer_genration_chain, filtering_questions


def get_json_data(file_path):
    """
    Get the JSON data from the file.
    Args:
        file_path (str): The path to the file.
    Returns:
        dict: The JSON data.
    """
    answer_genration_chain, filtering_questions = llm_pipline(file_path)
    
    # Limit the number of questions to avoid processing too many
    max_questions = 5
    filtering_questions = filtering_questions[:max_questions]
    
    # Generating the answers
    list_of_answers = []
    for question in filtering_questions:
        try:
            answer = answer_genration_chain.run(question)
            list_of_answers.append(answer)
        except Exception as e:
            print(f"Error generating answer for question: {str(e)}")
            list_of_answers.append("Unable to generate answer.")

    return list_of_answers

if __name__ == "__main__":
    # Example usage
    a = get_json_data('/home/omnai/Q_AND_A_Project/model_dev/file_loader/PDF_Store/test1.pdf')
    print("\n\n\n\n\n\n\n")

    for i in a:
        print(i)
    # a = llm_pipline('/home/omnai/Q_AND_A_Project/model_dev/file_loader/PDF_Store/test.pdf')
    # print(a)

