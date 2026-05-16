import os
import warnings
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

warnings.filterwarnings("ignore")
load_dotenv()

def main():
    if not os.path.exists("./chroma_db_pdf"):
        print("Vector database not found. Please run indexer.py first.")
        return
        
    print("Loading local embeddings...")
    from langchain_community.embeddings import HuggingFaceEmbeddings
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    db = Chroma(persist_directory="./chroma_db_pdf", embedding_function=embeddings)
    retriever = db.as_retriever(search_kwargs={"k": 3})
    
    if not os.environ.get("GOOGLE_API_KEY"):
        print("ERROR: GOOGLE_API_KEY is required for the Gemini LLM. Please add it to a .env file.")
        print("Format of .env file: GOOGLE_API_KEY=your_api_key_here")
        return
        
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
    
    def ask_question(query_dict):
        q = query_dict["query"]
        docs = retriever.invoke(q)
        context = "\n\n".join(d.page_content for d in docs)
        prompt = f"Use the following context to answer the question.\n\nContext:\n{context}\n\nQuestion: {q}\nAnswer:"
        ans = llm.invoke(prompt)
        return {"result": ans.content, "source_documents": docs}
    
    print("\n" + "="*50)
    print("Drive RAG is ready! Ask questions about your Google Docs.")
    print("Type 'quit' or 'exit' to stop.")
    print("="*50 + "\n")
    
    while True:
        query = input("\nYour question: ")
        if query.lower() in ['quit', 'exit']:
            break
            
        if not query.strip():
            continue
            
        print("\nThinking...")
        try:
            response = ask_question({"query": query})
            
            print("\n" + "-"*50)
            print(f"ANSWER:\n{response['result']}")
            print("-"*50)
            
            print("SOURCES:")
            sources = response.get("source_documents", [])
            seen_urls = set()
            for doc in sources:
                url = doc.metadata.get("source", "Unknown URL")
                title = doc.metadata.get("title", "Unknown Title")
                if url not in seen_urls:
                    print(f"- {title}: {url}")
                    seen_urls.add(url)
                    
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()