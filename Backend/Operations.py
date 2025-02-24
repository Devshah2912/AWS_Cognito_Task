from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from Database import SessionLocal
from models import User
import boto3
from botocore.exceptions import BotoCoreError, ClientError


AWS_REGION="ap-south-1"
USER_POOL_ID="ap-south-1_CnsVub3p4"
CLIENT_ID="o9inervfkqhmi94m6rsrn0lat"


cognito_client=boto3.client("cognito-idp",region_name=AWS_REGION)
# bcrypt_context=CryptContext(schemes=['bcrypt'],deprecated='auto')

router=APIRouter(
    prefix="/user"
)
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
db_dependency=Annotated[Session,Depends(get_db)]

class CreateUserRequest(BaseModel):
    name:str
    email:str
    phone:str
    password:str

class GetUser(BaseModel):
    email:str

@router.post("/createUser")
async def register_user(createUser:CreateUserRequest):
    try:
        response=cognito_client.sign_up(ClientId=CLIENT_ID,Username=createUser.email,Password=createUser.password,UserAttributes=[
            {"Name":"email","Value":createUser.email},
            {"Name":"name","Value":createUser.name},
            {"Name":"phone_number","Value":f"+91{createUser.phone}"},
        ])
        return {"message": "User registered successfully. Check email for verification!"}
    except cognito_client.exceptions.UsernameExistsException:
     raise  HTTPException(status_code=400, detail="User already exists Please try with different Email")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# @router.get("/getUserInfo")
# async def get_user_details(email: str):
#     try:
#         print(f"Fetching user details for: {email}")  # Debugging line
#         response = cognito_client.admin_get_user(
#             UserPoolId=USER_POOL_ID,
#             Username=email
#         )
#         print("Cognito Response:", response)  # Debugging line

#         user_attributes = {attr["Name"]: attr["Value"] for attr in response["UserAttributes"]}

#         return {
#             "name": user_attributes.get("name", "N/A"),
#             "email": user_attributes.get("email", "N/A"),
#             "phone_number": user_attributes.get("phone_number", "N/A"),
#         }

#     except cognito_client.exceptions.UserNotFoundException:
#         print("User not found in Cognito")  # Debugging line
#         raise HTTPException(status_code=404, detail="User not found in Cognito")

#     except ClientError as e:
#         print("Cognito ClientError:", e.response)  # Debugging line
#         error_message = e.response["Error"]["Message"]
#         raise HTTPException(status_code=400, detail=f"Cognito error: {error_message}")

#     except BotoCoreError as e:
#         print("BotoCoreError:", str(e))  # Debugging line
#         raise HTTPException(status_code=500, detail="AWS Cognito internal error")
