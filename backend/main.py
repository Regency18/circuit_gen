from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from equation import Equation

app = FastAPI()

class Receive(BaseModel):
    value: str
    newEq: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/equation")
async def equation(eq: Receive):
    recieved_value = eq.value
    try:
        equation = Equation(recieved_value)
        sent_value = equation.string_to_dict()
        return {"value": sent_value}
    except:
        raise HTTPException(status_code=400, detail="Equation invalid. Try again.")
    
    


