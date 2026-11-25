from pydantic import BaseModel,Field,ConfigDict,field_validator
from datetime import date
from typing import Literal


class PatientCreate(BaseModel):

    name:str=Field(min_length=1,pattern=r"^[A-Za-z ]+$")
    age:int=Field(ge=0,le=120)
    gender:Literal["Male","Female","Other"]
    ward:Literal["General","ICU","Emergency","Private"]
    department:Literal["Cardiology", "Dermatology", "Orthology", "Neurology"]
    doctor:Literal["Dr. Kumar", "Dr. Seetha", "Dr. Ram", "Dr.Ramiya"]
    admission_date:date
    status:Literal["Admitted", "Discharged"] = "Admitted"

    
    @field_validator("admission_date")
    @classmethod
    def validate_admission_date(cls, value):
        if value > date.today():
            raise ValueError("Admission date cannot be in the future")
        return value
     

class PatientResponse(PatientCreate):
    id:int

    model_config=ConfigDict(from_attributes=True)


class PatientUpdate(BaseModel):
    name: str | None = Field(
    default=None,
    min_length=1,
    pattern=r"^[A-Za-z ]+$"
)
    age: int |None = Field(default=None, ge=0, le=120)
    gender:  Literal["Male", "Female", "Other"] | None = None
    ward:  Literal["General", "ICU", "Emergency", "Private"] | None = None
    department: Literal["Cardiology", "Dermatology", "Orthology", "Neurology"] | None = None
    doctor:  Literal["Dr. Kumar", "Dr. Seetha", "Dr. Ram", "Dr.Ramiya"] | None = None
    admission_date: date | None = None
    status: Literal["Admitted", "Discharged"] | None = None

    @field_validator("admission_date")
    @classmethod
    def validate_admission_date(cls, value):
       if value is not None and value > date.today():
          raise ValueError("Admission date cannot be in the future")
       return value