from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.todo import todo_router
from tortoise.contrib.fastapi import register_tortoise
from fastapi.responses import FileResponse
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Only allow these origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index():
    return FileResponse(os.path.join("frontend", "index.html"))

app.include_router(todo_router)

register_tortoise(
    app=app,
    db_url="mysql://Ranit:12345@localhost:3306/tododb",
    modules={"models": ["api.models.todo"]},
    generate_schemas=False,
    add_exception_handlers=True,
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
