
from pathlib import Path

from langchain_chroma import Chroma
from langchain_core.documents import Document

from embeddings import get_embedding_model
from chunking import split_text_into_chunks
from pdf_utils import extract_text_from_pdf


VECTOR_DB_DIR = Path(__file__).parent / "chroma_db"


def get_vector_store():

    embedding_model = get_embedding_model()

    vector_store = Chroma(
        collection_name="document_qa",
        persist_directory=str(VECTOR_DB_DIR),
        embedding_function=embedding_model
    )

    return vector_store


def store_pdf_embeddings(file_path, filename):

    pages = extract_text_from_pdf(file_path)

    documents = []

    for page in pages:

        chunks = split_text_into_chunks(page["text"])

        for chunk in chunks:

            if chunk.strip():

                documents.append(
                    Document(
                        page_content=chunk,
                        metadata={
                            "source": filename,
                            "page": page["page"]
                        }
                    )
                )

    if not documents:
        raise ValueError("No extractable text found in PDF")

    vector_store = get_vector_store()

    # Remove previously indexed chunks of the same PDF
    vector_store.delete(
        where={"source": filename}
    )

    # Store fresh PDF chunks
    vector_store.add_documents(documents)

    return len(documents)
