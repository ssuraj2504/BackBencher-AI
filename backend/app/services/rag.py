import os
import pickle
from pypdf import PdfReader
import faiss
import numpy as np

from app.utils.embeddings import embed_texts

VECTOR_PATH = "vector_store/pdf_vectors.pkl"


def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text


def chunk_text(text: str, chunk_size=500, overlap=100) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


def store_pdf_vectors(chunks: list[str]):
    os.makedirs(os.path.dirname(VECTOR_PATH), exist_ok=True)

    embeddings = embed_texts(chunks)
    dim = embeddings.shape[1]

    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)

    with open(VECTOR_PATH, "wb") as f:
        pickle.dump((index, chunks), f)



def search_pdf(query: str, k=1) -> list[str]:
    if not os.path.exists(VECTOR_PATH):
        return []

    with open(VECTOR_PATH, "rb") as f:
        index, chunks = pickle.load(f)

    query_vec = embed_texts([query])
    distances, indices = index.search(query_vec, k)

    results = []
    for i in indices[0]:
        if i < len(chunks):
            results.append(chunks[i][:200])  # 🔒 VERY IMPORTANT

    return results


