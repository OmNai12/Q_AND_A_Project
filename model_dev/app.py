# from langchain.llms import CTransformers


# def load_model():
#     llm = CTransformers(
#         model='Model Development/model_logic/mistral-7b-instruct-v0.1.Q6_K.gguf',
#         model_type='mistral',
#         max_new_tokens=2048,
#         temperature=0.5,
#     )
#     return llm


# t = load_model()
# print(t("What is the capital of France?"))

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import uvicorn
from model_logic.engine import get_json_data

app = FastAPI()
@app.get("/")
async def root():
    return await get_json_data()