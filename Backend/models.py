from Database import Base
from sqlalchemy import Column,Integer,String,Boolean

class User(Base):
    __tablename__="user"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String,unique=True)
    age=Column(Integer)
    email=Column(String,unique=True)
    phone=Column(Integer)
    hashed_password=Column(String)

