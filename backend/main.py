
from fastapi import FastAPI, UploadFile, File, HTTPException
from pdf_utils import extract_text_from_pdf
from vector_store import store_pdf_embeddings
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from retrieval import search_documents
from answer import generate_answer
from pathlib import Path
import shutil

app = FastAPI(
    title="Document Q&A Bot",
    description="AI-powered PDF Question Answering System",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://documind-ai-orpin-phi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "Document Q&A Bot API is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }




@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    file_path = UPLOAD_DIR / Path(file.filename).name

    try:
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded PDF is empty"
            )

        with file_path.open("wb") as buffer:
            buffer.write(content)

        total_chunks = store_pdf_embeddings(
            file_path,
            file.filename
        )

        return {
            "message": "PDF uploaded and indexed successfully!",
            "filename": file.filename,
            "total_chunks": total_chunks
        }

    except HTTPException:
        if file_path.exists():
            file_path.unlink()
        raise

    except Exception as e:
        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail="PDF upload or indexing failed. Please try again."
        )

    finally:
        await file.close()



@app.get("/extract/{filename}")
def extract_pdf_text(filename: str):

    file_path = UPLOAD_DIR / Path(filename).name

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF not found"
        )

    extracted_pages = extract_text_from_pdf(file_path)

    return {
        "message": "PDF text extracted successfully!",
        "total_pages": len(extracted_pages),
        "pages": extracted_pages
    }



@app.post("/index/{filename}")
def index_pdf(filename: str):

    file_path = UPLOAD_DIR / Path(filename).name

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF not found"
        )

    try:
        total_chunks = store_pdf_embeddings(
            file_path,
            filename
        )

        return {
            "message": "PDF indexed successfully!",
            "filename": filename,
            "total_chunks": total_chunks
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



class SearchRequest(BaseModel):
    question: str
    filename: str | None = None


@app.post("/search")
def search_pdf(request: SearchRequest):

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    try:
        results = search_documents(
            request.question,
            k=4
        )

        return {
            "question": request.question,
            "total_results": len(results),
            "results": results
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



@app.post("/ask")
def ask_question(request: SearchRequest):

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    try:
        retrieved_chunks = search_documents(
            request.question,
            k=10,
            filename=request.filename
        )

        if not retrieved_chunks:
            return {
                "question": request.question,
                "answer": "No relevant information found in the uploaded documents.",
                "sources": []
            }

        context = "\n\n".join(
            [
                f"Source: {chunk['source']}, "
                f"Page: {chunk['page']}\n"
                f"{chunk['content']}"
                for chunk in retrieved_chunks
            ]
        )
        print("\n========== RETRIEVED CONTEXT ==========")

        for chunk in retrieved_chunks:
            print(f"\nSource: {chunk['source']} | Page: {chunk['page']}")
            print(chunk["content"])

        print("\n========== END CONTEXT ==========\n")

        answer = generate_answer(
            request.question,
            context
        )

        return {
            "question": request.question,
            "answer": answer,
            "sources": retrieved_chunks
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
