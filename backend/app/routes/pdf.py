import os
from fastapi import APIRouter, UploadFile, File, Depends

from app.utils.deps import get_current_user
from app.services.rag import (
    extract_text_from_pdf,
    chunk_text,
    store_pdf_vectors,
)

router = APIRouter(prefix="/pdf", tags=["PDF RAG"])

UPLOAD_DIR = "uploads/pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
def upload_pdf(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    pdf_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(pdf_path, "wb") as f:
        f.write(file.file.read())

    text = extract_text_from_pdf(pdf_path)
    chunks = chunk_text(text)

    store_pdf_vectors(chunks)

    return {
        "message": "PDF uploaded and indexed successfully",
        "chunks": len(chunks)
    }
