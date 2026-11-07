
from embeddings import get_embedding_model

embedding_model = get_embedding_model()

text = "Machine Learning enables computers to learn from data."

vector = embedding_model.embed_query(text)

print("Embedding generated successfully!")
print("Vector dimensions:", len(vector))
print("First 5 values:", vector[:5])
