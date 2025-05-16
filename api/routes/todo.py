from fastapi import APIRouter,HTTPException,status
from api.models.todo import ToDo
from api.schemas.todo import GetTodo,PutToDo,PostToDo

todo_router = APIRouter(prefix="/api",tags=["ToDo"])

@todo_router.get("/")               # Get Mapping for Read operation of CRUD
async def all_todos():
    data = ToDo.all()
    return await GetTodo.from_queryset(data)

@todo_router.post("/")              # Post Mapping for Create operation of CRUD
async def post_todo(body: PostToDo):
    row = await ToDo.create(**body.dict(exclude_unset=True))
    return await GetTodo.from_tortoise_orm(row)

@todo_router.put("/{key}")
async def update_todo(key:int, body:PutToDo):
    data = body.dict(exclude_unset=True)
    exists = await ToDo.filter(id=key).exists()

    if not exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="ToDo not found.")
    await ToDo.filter(id=key).update(**data)
    return await GetTodo.from_queryset_single(ToDo.get(id=key))


@todo_router.delete("/{key}")
async def delete_todo(key:int):
    exists = await ToDo.filter(id=key).exists()

    if not exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ToDo not found.")
    await ToDo.filter(id=key).delete()
    return "ToDo Deleted successfully"