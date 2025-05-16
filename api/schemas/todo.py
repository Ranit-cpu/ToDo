from pydantic import BaseModel,Field
from typing import Optional
from tortoise.contrib.pydantic import pydantic_model_creator
from api.models.todo import ToDo

GetTodo = pydantic_model_creator(ToDo, name="ToDo")

class PostToDo(BaseModel):
    task:str = Field(...,max_length=100)
    done:bool

class PutToDo(BaseModel):
    task:Optional[str] = Field(None, max_length=100)
    done:Optional[bool]

