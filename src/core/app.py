'''modules for fish growth'''
import pickle
import pandas as pd
from typing import List
from fastapi import (
    APIRouter, Request, Request, Response, Form, Depends, HTTPException
)
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi.templating import Jinja2Templates
from passlib.hash import bcrypt
# define modules
from src.core.models import User, Prediction
from src.core.schemas import UserSchema, PredictionSchema, MainSchema, Token
from src.core.connect import get_db
from src.core.exceptions import EXCEPTION_403_PERM
from src.core.auth import authenticate_user, create_token, get_current_user
from src.core.config import (
    admin_email,
    admin_pass,
    admin_fullname,
    admin_username,
    admin_phone,
    admin_perm
)

router = APIRouter()

# setting middlewares
templates = Jinja2Templates(directory="templates")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Load the trained model
with open('model/rf_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)


@router.get("/test")
def entry():
    '''test app set up'''
    return {"Hello": "World"}


# Function to create an admin user
def create_admin_user(db_session):
    """automate admin creations"""
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
    '''home route'''
    return templates.TemplateResponse("index.html", {"request": request})

# about
@router.get("/about")
async def about(request: Request):
    '''about us route'''
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


@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)):
    """ get all user if the permissions"""
    if "admin" not in current_user.permissions:
        raise EXCEPTION_403_PERM
    users = db.query(User).all()
    users_dict = [us.to_dict() for us in users]
    return JSONResponse(content=users_dict)


'''get specific user'''
@router.post("/login")
async def login_user(request: Request, login_user: MainSchema,  db: Session = Depends(get_db)) -> Token:
    # Query the user existance
    user = authenticate_user(login_user.username, login_user.password, db)
    token_str = create_token(user)
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
    request: Request, 
    input_data: PredictionSchema,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """predict fish growth endpoint"""
    input_df = [
        [
            input_data.temperature,
            input_data.turbidity,
            input_data.oxygen,
            input_data.ph_value,
            input_data.ammonia,
            input_data.nitrate,
            input_data.population,
            input_data.length
        ]
    ]

    # Make predictions using the loaded model
    predictions = model.predict(input_df)

    db_prediction = Prediction(
        temperature=input_data.temperature,
        turbidity=input_data.turbidity,
        oxygen=input_data.oxygen,
        ph_value=input_data.ph_value,
        ammonia=input_data.ammonia,
        nitrate=input_data.nitrate,
        population=input_data.population,
        length=input_data.length,
        weight=predictions[0],
        user_id=current_user.id
        )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    prediction_dict = db_prediction.to_dict()

    # return {"prediction": predictions[0]}
    return JSONResponse(content={
        "prediction": predictions[0],
        "db_prediction": prediction_dict}
    )


# Route to retrieve all prediction records
@router.get("/predictions")
async def get_predictions(request: Request,
                          db: Session = Depends(get_db),
                          current_user: str = Depends(get_current_user)):
    '''get current user predictions'''
    # Query all prediction records from the database for current user
    predictions = db.query(Prediction).filter_by(user_id=current_user.id).all()

    # Convert SQLAlchemy model instances to dictionaries
    predictions_dict = [prediction.to_dict() for prediction in predictions]
    return JSONResponse(content=predictions_dict)
