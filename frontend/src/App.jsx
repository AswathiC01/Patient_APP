
import "./App.css"
import { useState, useEffect, useRef } from "react";
const API_URL = "https://patient-app-backend-eight.vercel.app";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ward, setWard] = useState("");
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [message, setMessage] = useState("");
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [editId, setEditId] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
  fetch(`${API_URL}/patients/`)
    .then((response) => response.json())
    .then((data) => setPatients(data))
    .catch((error) => console.log(error));
}, []);


const handleSubmit = async (e) => {
  e.preventDefault();

const patient = {
    name,
    age: Number(age),
    gender,
    ward,
    department,
    doctor,
    admission_date: admissionDate,
    status: "Admitted"
  };

try {
  const response = await fetch(
  editId? `${API_URL}/patients/${editId}`: `${API_URL}/patients/`,
  {
    method: editId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patient)
    });

   if (!response.ok) {
      const error = await response.json();
      setMessage(JSON.stringify(error.detail));
      return;
    }

  const savedPatient = await response.json();

if (editId) {
  setPatients((prevPatients) =>
    prevPatients.map((patient) =>
      patient.id === editId ? savedPatient : patient
    )
  );
  setMessage("Patient updated successfully!");
} else {
  setPatients((prevPatients) => [...prevPatients, savedPatient]);
  setMessage("Patient added successfully!");
}
   setName("");
   setAge("");
   setGender("");
   setWard("");
   setDepartment("");
   setDoctor("");
   setAdmissionDate("");
   setEditId(null);

  } catch (error) {
    setMessage("Could not connect to the backend.");
  }
};


const handleDelete = async (patientId) => {
const confirmDelete = window.confirm("Are you sure you want to delete this patient?");

if (!confirmDelete) {
    return;
   }
try {
    const response = await fetch(
      `${API_URL}/patients/${patientId}`,
      {
        method: "DELETE"
      }
    );
  
        if (response.ok) {
      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient.id !== patientId)
      );
    } else {
      alert("Failed to delete patient");
    }

} catch (error) {
    console.log(error);
  }

};


const handleDischarge = async (patientId) => {
const discharged=window.confirm("Are you sure you want to discharge this patient?")
  if (!discharged) {
    return;
  }   
try {
  const response = await fetch(
    `${API_URL}/patients/${patientId}/discharge`,
    {
      method: "PATCH"
    }
  );

  if (response.ok) {
    const updatedPatient = await response.json();

    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === patientId ? updatedPatient : patient
      )
    );
  } else {
    alert("Failed to discharge patient");
  }

} catch (error) {
  console.log(error);
} 
}

const handleEdit = (patient) => {

  setEditId(patient.id);
  setName(patient.name);
  setAge(patient.age);
  setGender(patient.gender);
  setWard(patient.ward);
  setDepartment(patient.department);
  setDoctor(patient.doctor);
  setAdmissionDate(patient.admission_date);

  formRef.current.scrollIntoView({
  behavior: "smooth",
  block: "start"
});
};


const filteredPatients = patients.filter((patient) =>
  patient.name.toLowerCase().includes(search.toLowerCase())
 &&
  (wardFilter === "" || patient.ward === wardFilter)&&
  (departmentFilter === "" || patient.department === departmentFilter) &&
  (doctorFilter === "" || patient.doctor === doctorFilter)
);

  return (
    <div className="container">
      <h1>Patient Admission Management</h1>

     
      <form ref={formRef} onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required pattern="[A-Za-z ]+"/>
       

        <label>Age</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required min="0" max="120" />

        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <label>Ward</label>
        <select value={ward} onChange={(e) => setWard(e.target.value)} required>
          <option value="">Select Ward</option>
          <option>General</option>
          <option>ICU</option>
          <option>Emergency</option>
          <option>Private</option>
        </select>

        <label>Department</label>
        <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
          <option value="">Select Department</option>
          <option>Cardiology</option>
          <option>Dermatology</option>
          <option>Orthology</option>
          <option>Neurology</option>
        </select>

        <label>Doctor</label>
        <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
          <option value="">Select Doctor</option>
          <option>Dr. Kumar</option>
          <option>Dr. Seetha</option>
          <option>Dr. Ram</option>
          <option>Dr.Ramiya</option>
        </select>

        <label>Admission Date</label>
        <input
          type="date"
          value={admissionDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setAdmissionDate(e.target.value)} required
        />

      <button type="submit">{editId ? "Update Patient" : "Add Patient"}</button>
      </form>
      <h2>Patient Records</h2>
       <input type="text"placeholder="Search patient by name"value={search}
           onChange={(e) => setSearch(e.target.value)}
/>

<select
  value={wardFilter}
  onChange={(e) => setWardFilter(e.target.value)}
>
  <option value="">All Wards</option>
  <option value="General">General</option>
  <option value="ICU">ICU</option>
  <option value="Emergency">Emergency</option>
  <option value="Private">Private</option>
</select>


<select
  value={departmentFilter}
  onChange={(e) => setDepartmentFilter(e.target.value)}
>
  <option value="">All Departments</option>
  <option value="Cardiology">Cardiology</option>
  <option value="Dermatology">Dermatology</option>
  <option value="Orthology">Orthology</option>
  <option value="Neurology">Neurology</option>
</select>


<select
  value={doctorFilter}
  onChange={(e) => setDoctorFilter(e.target.value)}
>
  <option value="">All Doctors</option>
  <option value="Dr. Kumar">Dr. Kumar</option>
  <option value="Dr. Seetha">Dr. Seetha</option>
  <option value="Dr. Ram">Dr. Ram</option>
  <option value="Dr. Ramiya">Dr. Ramiya</option>
</select>

<div className="table-wrapper">
<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Age</th>
      <th>Gender</th>
      <th>Ward</th>
      <th>Department</th>
      <th>Doctor</th>
      <th>Admission Date</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {filteredPatients.map((patient) => (
      <tr key={patient.id}>
        <td>{patient.id}</td>
        <td>{patient.name}</td>
        <td>{patient.age}</td>
        <td>{patient.gender}</td>
        <td>{patient.ward}</td>
        <td>{patient.department}</td>
        <td>{patient.doctor}</td>
        <td>{patient.admission_date}</td>
        <td>{patient.status}</td>
        <td><button type="button" onClick={() => handleDelete(patient.id)}>Delete</button>
        <button type="button" onClick={() => handleDischarge(patient.id)}disabled={patient.status === "Discharged"}>
        {patient.status === "Discharged" ? "Discharged" : "Mark Discharged"}</button>
        <button type="button" onClick={() => handleEdit(patient)}>Edit</button>
</td>
      </tr>
    ))}
  </tbody>
</table>
</div>
      <p className="message">{message}</p>
    </div>
  );
}

export default App;
