import app
import uvicorn
from fastapi.staticfiles import StaticFiles

if __name__== "__main__":
    uvicorn.run("app.main:app", reload=True)

app.mount("/", StaticFiles(directory="app/frontend", html=True), name="frontend")