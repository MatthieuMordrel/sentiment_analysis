from fastapi import FastAPI

@app.get("/api/python")
def get_info():
    return {"message": "This is a GET request to the /api/python endpoint"}