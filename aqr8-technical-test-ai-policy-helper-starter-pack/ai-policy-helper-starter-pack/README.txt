Technical Implementation
Production-Ready RAG Pipeline: Developed a modular system separating Embedding, Vector Storage (Qdrant), and LLM Generation. The architecture supports hot-swapping between local stubs and production providers (OpenRouter/OpenAI) via environment variables.

Deterministic Data Integrity: Implemented UUIDv5 hashing for document chunks. This ensures that re-ingesting the same documentation does not create duplicate entries in the vector store, maintaining a clean and efficient search index.

Infrastructure & Reliability: Optimized the Docker containerization by implementing a custom Netcat-based health check for the backend's Distroless image. This ensures the frontend only attempts to connect once the API and vector database are fully healthy.

Problem Solving (The "401" Resolution)
Authentication Debugging: During integration, identified a 401 Unauthorized error from the external LLM provider. Traced the issue to a quota/account restriction on the shared API key.

Solution: Validated the network handshake and Python openai client logic, then successfully migrated to a private OpenRouter credential to verify the full end-to-end generation loop.

How to Run (Quick Start)
This project is fully containerized. Follow these 3 steps to launch the complete RAG stack.

1. Environment Setup
Create a .env file in the root directory. You can copy the template from .env.example:
For this test, I have explicitly not included the .env file as well as any references to the API key. 
Including this file is extremely dangerous and will compromise sensitive data that would heavily impact the organization financially.

Bash
cp .env.example .env
Open the .env file and add your OpenRouter API Key:

Bash
OPENROUTER_API_KEY=your_key_here
LLM_PROVIDER=openrouter
VECTOR_STORE=qdrant

2. Launch with Docker
Run the following command to build and start the Backend (FastAPI), Frontend (Next.js), and Vector Database (Qdrant):

Bash
docker compose up --build
Wait for the terminal to show: Application startup complete.

3. Access the Application
Frontend UI: http://localhost:3000

Backend API Docs: http://localhost:8000/docs

Qdrant Dashboard: http://localhost:6333/dashboard

Testing the RAG Pipeline
Once the UI is loaded:

Ingest Data: Click the "Ingest Docs" button. This will chunk, embed, and store the sample markdown files into Qdrant.

Verify Metrics: The UI will update to show Total Docs: 6 and Total Chunks: 12.

Ask a Question: Use the chat to ask: "What’s the shipping SLA to East Malaysia for bulky items?"

Check Grounding: Ensure the assistant provides the specific 7–10 days window and cites Delivery_and_Shipping.md.

If you require an API key to test the openrouterllm, please message me.
