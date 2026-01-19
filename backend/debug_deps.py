try:
    print("Importing transformers...")
    import transformers
    print(f"Transformers version: {transformers.__version__}")
    
    print("Importing sentence_transformers...")
    from sentence_transformers import SentenceTransformer
    print(f"SentenceTransformers version: {SentenceTransformer.__module__}")
    
    print("Importing CrossEncoder...")
    from sentence_transformers import CrossEncoder
    print("CrossEncoder imported successfully")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
