import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load env variables (supporting both local and parent directories)
load_dotenv()
load_dotenv("../.env")

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

app = FastAPI(title="LivestockAI Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG components globally
print("Loading embeddings and vector DB...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db = Chroma(persist_directory="./chroma_db_pdf", embedding_function=embeddings)
retriever = db.as_retriever(search_kwargs={"k": 3})

# Initialize LLM
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# Prefer Groq if available, fallback to Gemini
if GROQ_API_KEY:
    print("Using Groq (Llama-3.3) for AI generation...")
    llm = ChatGroq(model="llama-3.3-70b-specdec", temperature=0.2, groq_api_key=GROQ_API_KEY)
elif GOOGLE_API_KEY:
    print("Using Google (Gemini) for AI generation...")
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.2)
else:
    print("Warning: No LLM API Key found!")
    llm = None

class ReportRequest(BaseModel):
    animalType: str
    herdSize: str
    language: str = "en"

class ChatRequest(BaseModel):
    query: str

@app.post("/api/generate-report")
async def generate_report(request: ReportRequest):
    if not llm:
        raise HTTPException(status_code=500, detail="Google API Key missing.")

    # 1. Use the vector database to find context about this animal
    query_str = f"nutrition hydration schedule recommendations for {request.animalType} livestock"
    docs = retriever.invoke(query_str)
    context = "\n\n".join(d.page_content for d in docs)
    
    # 2. Build the System Prompt for JSON generation based on language
    system_prompt = "You are a helpful and knowledgeable agricultural AI assistant. You must always reply with valid JSON only."
    language_instruction = ""
    
    if request.language == 'darija':
        system_prompt = "You are a helpful agricultural AI assistant who speaks Moroccan Darija (الدارجة المغربية). You must always reply with valid JSON only. All text values in the JSON must be written in Moroccan Darija using Arabic script."
        language_instruction = "\nIMPORTANT: All text values in the JSON (summary, action descriptions, recommendations) MUST be written in Moroccan Darija (الدارجة المغربية) using Arabic script. The field names/keys must stay in English."
    elif request.language == 'tamazight':
        system_prompt = "You are a helpful agricultural AI assistant who speaks Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ). You must always reply with valid JSON only. All text values in the JSON must be written in Tamazight using Tifinagh script (ⵜⵉⴼⵉⵏⴰⵖ) or Latin transliteration."
        language_instruction = "\nIMPORTANT: All text values in the JSON (summary, action descriptions, recommendations) MUST be written in Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ). Use Tifinagh script or Latin transliteration. The field names/keys must stay in English."

    prompt_content = f"""
    You are an expert agricultural AI assistant. Generate a highly structured daily nutrition and hydration plan for livestock.
    Animal Type: {request.animalType}
    Herd Size: {request.herdSize}
    {language_instruction}
    
    Here is some authoritative context retrieved from our specialized veterinary database:
    ---
    {context}
    ---
    
    Use the context above to inform your recommendations. 
    Please provide the response ONLY as a valid JSON object with the exact following structure, no markdown formatting or extra text:
    {{
      "overview": {{
        "animal": "animal name",
        "size": number,
        "summary": "1 sentence summary based on context"
      }},
      "dailyNeeds": {{
        "water": "Total Liters string",
        "food": "Total kg string",
        "waterPerHead": "L/head string",
        "foodPerHead": "kg/head string"
      }},
      "nutritionalBreakdown": [
        {{ "name": "Carbohydrates", "value": number }},
        {{ "name": "Protein", "value": number }},
        {{ "name": "Fiber", "value": number }},
        {{ "name": "Fats", "value": number }},
        {{ "name": "Minerals/Vitamins", "value": number }}
      ],
      "schedule": [
        {{ "time": "06:00 AM", "action": "Morning feed action description based on context" }},
        {{ "time": "12:00 PM", "action": "Midday action description" }},
        {{ "time": "05:00 PM", "action": "Evening action description" }}
      ],
      "recommendations": {{
        "localFood": "Recommendation about local food sourcing based on context",
        "healthWarnings": "Important health warning based on context",
        "costSaving": "Cost saving tip",
        "productivity": "Productivity tip"
      }}
    }}
    """
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=prompt_content)
    ]
    
    try:
        response = llm.invoke(messages)
        
        # Clean up Markdown formatting (if Gemini wrapped it in ```json)
        raw_json = response.content.strip()
        if raw_json.startswith("```json"):
            raw_json = raw_json[7:]
        if raw_json.endswith("```"):
            raw_json = raw_json[:-3]
            
        parsed_json = json.loads(raw_json.strip())
        return parsed_json
    except Exception as e:
        print(f"Error generating report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not llm:
        raise HTTPException(status_code=500, detail="Google API Key missing.")

    docs = retriever.invoke(request.query)
    context = "\n\n".join(d.page_content for d in docs)
    prompt = f"Use the following context to answer the question.\n\nContext:\n{context}\n\nQuestion: {request.query}\nAnswer:"
    
    try:
        ans = llm.invoke(prompt)
        return {"result": ans.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
