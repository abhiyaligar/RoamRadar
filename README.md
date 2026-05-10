# Traveloop 🌍✈️

**Traveloop** is a personalized, intelligent, and collaborative platform that transforms the way individuals plan and experience travel. Empowering users to dream, design, and organize multi-city trips with ease.

## Project Structure
- **/Docs:** Comprehensive documentation including Product Requirements, System Architecture, Database Schema, and API definitions.
- **/backend:** FastAPI application powering the REST API, PostgreSQL database models, and Alembic migrations.

## Getting Started

### Backend Setup
1. Navigate to the `backend` directory.
2. Activate the virtual environment (`.\venv\Scripts\activate` on Windows).
3. Ensure you have your `DATABASE_URL` configured in `backend/.env`.
4. Run migrations: `alembic upgrade head`.
5. Start the server: `uvicorn main:app --reload`.
6. Access API documentation at `http://localhost:8000/docs`.

---
*Built as a multi-city travel planning application.*
