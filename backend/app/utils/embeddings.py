from sentence_transformers import SentenceTransformer
import numpy as np

# lightweight, fast, offline
model = SentenceTransformer("all-MiniLM-L6-v2")


def embed_texts(texts: list[str]) -> np.ndarray:
    return model.encode(texts, convert_to_numpy=True)
