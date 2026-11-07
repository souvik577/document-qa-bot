
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os

load_dotenv()


def generate_answer(question, context):

    api_key = os.getenv("OPENROUTER_API_KEY")
    model_name = os.getenv("OPENROUTER_MODEL")

    if not api_key:
        raise ValueError("OPENROUTER_API_KEY is missing")

    if not model_name:
        raise ValueError("OPENROUTER_MODEL is missing")

    llm = ChatOpenAI(
        model=model_name,
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        temperature=0.2,
        max_tokens=1000,
        default_headers={
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Document Q&A Bot"
        }
    )

    prompt = ChatPromptTemplate.from_template("""
    You are a helpful Document Question Answering Assistant.

    Answer the user's question using ONLY the provided context.

    If the answer is not available in the context,
    clearly say that the information is not available
    in the uploaded document.

    Do not make up information.

    Context:
    {context}

    User Question:
    {question}

    Answer:
    """)

    chain = prompt | llm

    response = chain.invoke({
        "context": context,
        "question": question
    })

    return response.content
