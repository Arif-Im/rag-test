import pytest
from httpx import AsyncClient
from main import app  # Import your FastAPI app

@pytest.mark.asyncio
async def test_health_check():
    """Verify the API is alive."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

@pytest.mark.asyncio
async def test_ingestion_trigger():
    """Verify the ingestion endpoint starts correctly."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/ingest")
    assert response.status_code == 200
    assert "status" in response.json()

@pytest.mark.asyncio
async def test_ask_endpoint_with_context():
    """Verify the RAG pipeline returns an answer and citations."""
    payload = {"query": "What is the return policy for blenders?"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Note: This requires a working API Key in your test environment .env
        response = await ac.post("/ask", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "citations" in data
    assert len(data["citations"]) > 0  # Proves RAG is working!