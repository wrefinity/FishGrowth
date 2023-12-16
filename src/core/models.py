from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from src.core.database import Base

class User(Base):

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


class Prediction(Base):

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