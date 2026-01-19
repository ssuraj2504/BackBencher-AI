from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

class SessionCreate(BaseModel):
    subject: str


class SessionResponse(BaseModel):
    id: int
    subject: str
    is_active: int

    class Config:
        from_attributes = True
