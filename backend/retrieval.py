from vector_store import get_vector_store


def search_documents(query, k=4, filename=None):

    vector_store = get_vector_store()

    if filename:
        results = vector_store.similarity_search(
            query,
            k=k,
            filter={"source": filename}
        )
    else:
        results = vector_store.similarity_search(
            query,
            k=k
        )

    formatted_results = []

    for doc in results:
        formatted_results.append({
            "content": doc.page_content,
            "source": doc.metadata.get("source"),
            "page": doc.metadata.get("page")
        })

    return formatted_results