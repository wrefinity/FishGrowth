'''auth module'''
import json
import datetime
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
import jwt
# user define function
from src.core.connect import get_db
from src.core.schemas import UserSchema
from src.core.models import User
from src.core.database import session_local
from src.core.exceptions import EXCEPTION_404, EXCEPTION_401_PERM
oauth_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={'items': 'permissions to access items'}
)


def authenticate_user(username: str, password: str, db: Session) -> UserSchema:
    """authenticate user """
    user = db.query(User).filter(
        User.username == username,
    ).first()
    if user and bcrypt.verify(password, user.password):
        return user
    raise EXCEPTION_404


def get_current_user(
    token: str = Depends(oauth_scheme),
    db: Session = Depends(get_db)
) -> UserSchema:
    """getting current user"""
    decoded = jwt.decode(token, 'secret', algorithms=['HS256'])
    username = decoded['username']
    user = db.query(User).filter(User.username == username).first()
    if user:
        return user
    raise EXCEPTION_404


def create_token(user: UserSchema) -> str:
    """create user token """
    payload = {'username': user.username, 'iat': datetime.datetime.utcnow(),
               'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=90)}
    token = jwt.encode(payload, key='secret')
    return token


def load_permission(username: str) -> list[str]:
    '''permission checker'''
    with session_local() as db:
        user = db.query(User).filter(User.username == username).first()
        if user:
            permissions = user.permissions
            user_permissions = json.loads(permissions)
            return user_permissions
        else:
            return None


class PermissionChecker:

    '''check permission'''
    def __init__(self, required_permissions: list[str]) -> None:
        self.required_permissions = required_permissions

    def __call__(self, user: UserSchema = Depends(get_current_user)) -> bool:
        for r_perm in self.required_permissions:
            if r_perm not in user.permissions:
                raise EXCEPTION_401_PERM
        return True
    