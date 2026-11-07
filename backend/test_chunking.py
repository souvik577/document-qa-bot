
from chunking import split_text_into_chunks

sample_text = """
Artificial Intelligence is a branch of computer science.
Machine Learning is a subset of Artificial Intelligence.
Deep Learning uses neural networks to learn from data.
"""

chunks = split_text_into_chunks(sample_text)

for i, chunk in enumerate(chunks):
    print(f"\nChunk {i + 1}:")
    print(chunk)
