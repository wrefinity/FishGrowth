'''modules for fish growth'''
import json
import pickle
from beanie import PydanticObjectId
import pandas as pd
from typing import List
from fastapi import (
    APIRouter, Request, Request, Response, Form, Depends
)
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from passlib.hash import bcrypt
# define modules
from src.core.models import User, Prediction
from src.core.schemas import UserSchema, PredictionSchema, MainSchema, Token
from src.core.connect import get_db
from src.core.auth import authenticate_user, create_token
from src.core.config import (
    admin_email,
    admin_pass,
    admin_fullname,
    admin_username,
    admin_phone,
    admin_perm
)

router = APIRouter()
templates = Jinja2Templates(directory="templates")


# Load the trained model
with open('model/rf_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)


@router.get("/test")
def entry():
    '''test app set up'''
    return {"Hello": "World"}

# Function to create an admin user
def create_admin_user(db_session):
    admin_user = User(
        email=admin_email,
        password= bcrypt.hash(admin_pass),
        username=admin_username,
        fullname=admin_fullname,
        phone=admin_phone,
        permissions=[admin_perm]
    )
    db_session.add(admin_user)
    db_session.commit()

# entry
@router.get("/")
async def homex(request: Request, db: Session = Depends(get_db)):
    return templates.TemplateResponse("index.html", {"request": request})

# about
@router.get("/about")
async def homex(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})


# ================== user session ===============================
@router.post("/signup")
async def add_user(request: Request,  user_input: UserSchema, db: Session = Depends(get_db)) -> UserSchema:
    try:
        hashed_password = bcrypt.hash(user_input.password)
        
        user = User(
            password=hashed_password,
            email=user_input.email,
            username=user_input.username,
            phone=user_input.phone,
            fullname=user_input.fullname,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"message": "Error processing signup request", "detail": str(e)})


'''get specific user'''
@router.post("/login")
async def login_user(request:Request, login_user:MainSchema,  db: Session = Depends(get_db)) -> Token:
    # Query the user existance
    user = authenticate_user(login_user.username, login_user.password, db)
    token_str = create_token(user)
    # token = Token(access_token=token_str, token_type='bearer')
    # content = {
    #     'token': token,
    #     'username':user.username
    # }
    # return JSONResponse(content=content)

        # Build the JSON response
    content = {
        'token': {
            'access_token': token_str,
            'token_type': 'bearer'
        },
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'fullname': user.fullname,
            'phone': user.phone,
            'permissions': user.permissions
        }
    }
    return JSONResponse(content=content)


# ==================== prediction session =================
@router.post("/predict")
async def predict(
    request:Request, 
    input_data: List[PredictionSchema],
    db: Session = Depends(get_db)
):
    # Convert input data to a DataFrame
    input_df = pd.DataFrame([item.dict() for item in input_data])

    # Make predictions using the loaded model
    predictions = model.predict(input_df)
    print("==============prediction==================")
    print(predictions)

    # db_prediction = Prediction(
    #     temperature=input_df.temperature,
    #     turbidity=input_df.turbidity,
    #     oxygen=input_df.oxygen,
    #     ph_value=input_df.ph_value,
    #     ammonia=input_df.ammonia,
    #     nitrate=input_df.nitrate,
    #     population=input_df.population,
    #     length=input_df.length,
    #     weight=predictions[0]
    #     )
    # db.add(db_prediction)
    # db.commit()
    # db.refresh(db_prediction)
    return {"prediction": predictions[0]}
    # return {"message": "Prediction record saved successfully"}

# Route to retrieve all prediction records
@router.get("/get_predictions/")
async def get_predictions(request: Request, db: Session = Depends(get_db)):
    # Query all prediction records from the database
    predictions = db.query(Prediction).all()
    return templates.TemplateResponse("predictions.html", {"request": request, "predictions": predictions})


# @router.get("/")
# async def get_tasks(
#     request: Request,
#     response: Response
# ):
#     """ Get form page and results """
#     # tasks_main = await Task.find().project(TaskView).to_list()
#     context = {"request": request, "tasks": []}
#     response.status_code = status.HTTP_200_OK
#     return templates.TemplateResponse("index.html", context)

@router.post('/prediction')
async def prediction(
    request: Request, 
    response: Response,
    email: str = Form(...),
    password: str = Form(...) ):
    pass


# @router.post('/scrape')
# async def scrap_task(
#     request: Request, 
#     response: Response,
#     file: UploadFile = File(...)
# ):
#     """ Register new scraping task """
#     csv_list: List[Dict[str, any]] = []
#     try:
#         csv_bytes = file.file.read()
#         buffer = BytesIO(csv_bytes)
#         print(buffer)
#         csv_cls = PandasCsv()
#         csv_list = csv_cls.read_csv_to_list(buffer)
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f'Something went wrong -> {e}')
#     finally:
#         # closing both the file and the buffer 
#         buffer.close()
#         file.file.close()

#     new_task = Task()
#     # trigger task
#     task_result = create_task.delay(
#         str(new_task.id),
#         csv_list
#     )
#     print(f"celery with the task id started: {task_result.id}")
#     new_task.celery_task_id = task_result.id

#     await new_task.create()
#     response.status_code = status.HTTP_200_OK
#     return new_task.model_dump(exclude=["results", "scraped_urls"])
    

# @router.get("/taskss")
# async def all_tasks(
#     request: Request,
#     response: Response
# ):
#     """ Get form page and results """
#     tasks_main = await Task.find().project(TaskView).to_list()
#     context = {"request": request, "tasks": tasks_main}
#     response.status_code = status.HTTP_200_OK
#     return templates.TemplateResponse("tasks.html", context)


# @router.get("/specific-task/{task_id}")
# async def query_specific_task(
#     request: Request,
#     task_id: str,
# ):
#     '''specifics tasks'''
#     tasks = await TaskResult.find(
#         {"taskId": PydanticObjectId(task_id)}
#     ).to_list()
#     context = {
#         "request": request,
#         "data": tasks,
#         "task_id": task_id
#     }
#     return templates.TemplateResponse("task.html", context)


# @router.get("/success-task/{task_id}")
# async def query_success_task(
#     request: Request,
#     task_id: str,
# ):
#     '''specifics tasks'''
#     tasks = await TaskResult.find(
#         {"taskId": PydanticObjectId(task_id)}
#     ).to_list()
#     context = {
#         "request": request,
#         "data": tasks,
#         "task_id": task_id
#     }
#     return templates.TemplateResponse("task.html", context)

