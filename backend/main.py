from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI,Depends,Query,HTTPException
from sqlalchemy.orm import Session
from database import engine,Base,get_db
import models
import schemas


Base.metadata.create_all(bind=engine)

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return{"message":"Patient Management API is running!"}


@app.post("/patients/",response_model=schemas.PatientResponse)
def create_patient(patient: schemas.PatientCreate,db: Session=Depends(get_db)):

    new_patient=models.Patient(**patient.model_dump())

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


@app.get("/patients/",response_model=list[schemas.PatientResponse])
def get_patients(
    search: str=Query(None),
    ward:str=Query(None),
    department: str=Query(None),
    doctor: str=Query(None),
    patient_id: int =Query(None),
    db:Session =Depends(get_db)):
 
    query=db.query(models.Patient)
    print("DATABASE RECORDS:", db.query(models.Patient).count())

    if search:
        query=query.filter(models.Patient.name.contains(search))
    patients = query.all()

    if ward:
        query=query.filter(models.Patient.ward==ward)

    if department:
        query=query.filter(models.Patient.department==department)

    if doctor:
        query=query.filter(models.Patient.doctor==doctor)

    if patient_id:
        query=query.filter(models.Patient.id== patient_id)    

    patients=query.all()

    return patients


@app.put("/patients/{patient_id}",response_model=schemas.PatientResponse)
def update_patient(
    patient_id:int,
    patient:schemas.PatientUpdate,
    db: Session=Depends(get_db)
):

    existing_patient=db.query(models.Patient).filter(
        models.Patient.id== patient_id
    ).first()

    if existing_patient is None:
        raise HTTPException(status_code=404,detail="Patient not found")

    update_data=patient.model_dump(exclude_unset=True)

    for key,value in update_data.items():
        setattr(existing_patient,key,value)

    db.commit()
    db.refresh(existing_patient)    


    return existing_patient



@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int, db:Session=Depends(get_db)):
    patient=db.query(models.Patient).filter(
        models.Patient.id == patient_id
    ).first()

    if patient is None:
        raise HTTPException(status_code=404,detail="Patient not found")
    db.delete(patient)
    db.commit()

    return{"message": "Patient deleted successfully"}

@app.patch("/patients/{patient_id}/discharge")
def discharge_patient(patient_id: int , db:Session=Depends(get_db)):
    patient=db.query(models.Patient).filter(
    models.Patient.id == patient_id
    ).first()


    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient.status="Discharged"

    db.commit()
    db.refresh(patient)


    return patient


