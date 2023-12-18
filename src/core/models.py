'''model schemas definitions'''
from typing import Dict
from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from src.core.database import Base


class User(Base):
    '''users schemas'''

    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String)
    password = Column(String)
    username = Column(String)
    fullname = Column(String)
    phone = Column(String)
    permissions = Column(JSON, default=['users'])

    # Add a relationship to the predictions table
    predictions = relationship("Prediction", back_populates="user")

    def to_dict(self):
        """retrive users"""
        return {
            "id": self.id,
            "email": self.email, 
            "username": self.username,
            "fullname": self.fullname,
            "phone": self.phone,
            "permissions": self.permissions,
        }


class Prediction(Base):
    """prediction model schema"""

    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    temperature = Column(Float)
    turbidity = Column(Integer)
    oxygen = Column(Float)
    ph_value = Column(Float)
    ammonia = Column(Float)
    nitrate = Column(Float)
    population = Column(Integer)
    length = Column(Float)
    weight = Column(Float)

    # A foreign key column referencing the id of the users table
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="predictions")

    def to_dict(self) -> Dict[str, float]:
        '''convert to dictionary'''
        return {
            'id': self.id,
            'temperature': self.temperature,
            'turbidity': self.turbidity,
            'oxygen': self.oxygen,
            'ph_value': self.ph_value,
            'ammonia': self.ammonia,
            'nitrate': self.nitrate,
            'population': self.population,
            'length': self.length,
            'weight': self.weight,
            'user_id': self.user_id,
            'username': self.user.username if self.user else None,
        }