''''''
from pydantic import BaseModel
from typing import Optional, List

class MainSchema(BaseModel):
    password:Optional[str] = None
    username:Optional[str] = None

class UserSchema(MainSchema):
    email:str
    fullname:str
    phone:str
    permissions: Optional[List[str]] = ["user"]

# authentication token
class Token(BaseModel):
    '''token schema'''
    access_token: str
    token_type: str


class PredictionSchema(BaseModel):
    '''predict schema'''
    temperature: float
    turbidity: int
    oxygen: float
    ph_value: float
    ammonia: float
    nitrate: int
    population: int
    length: float
    weight: float | None = None
