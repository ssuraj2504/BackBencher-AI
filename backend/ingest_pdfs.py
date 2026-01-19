import os
from app.services.rag import extract_text_from_pdf, chunk_text, store_pdf_vectors

PDF_DIR = "ingest_pdfs"


def ingest_all_pdfs():
    all_chunks = []

    for filename in os.listdir(PDF_DIR):
        if filename.lower().endswith(".pdf"):
            path = os.path.join(PDF_DIR, filename)
            print(f"[+] Ingesting {filename}")

            text = extract_text_from_pdf(path)
            chunks = chunk_text(text)
            all_chunks.extend(chunks)

    store_pdf_vectors(all_chunks)
    print(f"[✓] Ingested {len(all_chunks)} chunks from PDFs")


if __name__ == "__main__":
    ingest_all_pdfs()
