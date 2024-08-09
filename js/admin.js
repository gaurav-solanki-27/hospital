import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';
import { db } from './config.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    const auth = getAuth();
    const logoutBtn = document.getElementById('logout-btn');
    const addDoctorBtn = document.getElementById('add-doctor-btn');
    const addPatientBtn = document.getElementById('add-patient-btn');
    const postOperationBtn = document.getElementById('post-operation-btn');
    let isUpdating = false;
    let updateId = null;
    let updateType = null;

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = '/html/index.html'; // Redirect to login page
            } catch (error) {
                console.error('Sign out error:', error.message);
            }
        });
    }

    // Handle adding or updating doctor
    if (addDoctorBtn) {
        addDoctorBtn.addEventListener('click', async () => {
            const name = document.getElementById('doctor-name').value;
            const qualification = document.getElementById('doctor-qualification').value;
            const specialty = document.getElementById('doctor-specialty').value;
            const experience = document.getElementById('doctor-experience').value;
            const availability = document.getElementById('doctor-availability').value;

            try {
                if (isUpdating && updateType === 'doctor') {
                    await updateDoc(doc(db, 'doctors', updateId), {
                        name,
                        qualification,
                        specialty,
                        experience,
                        availability,
                        updatedAt: serverTimestamp()
                    });
                    showMessage('Doctor updated successfully!', 'success');
                    addDoctorBtn.textContent = 'Add Doctor';
                } else {
                    await addDoc(collection(db, 'doctors'), {
                        name,
                        qualification,
                        specialty,
                        experience,
                        availability,
                        createdAt: serverTimestamp()
                    });
                    showMessage('Doctor added successfully!', 'success');
                }
                document.getElementById('doctor-form').reset();
                isUpdating = false;
                updateId = null;
                updateType = null;
                fetchDoctors(); // Refresh the list
            } catch (error) {
                showMessage('Error adding/updating doctor: ' + error.message, 'error');
            }
        });
    }

    // Handle adding or updating patient
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', async () => {
            const name = document.getElementById('patient-name').value;
            const age = document.getElementById('patient-age').value;
            const gender = document.getElementById('patient-gender').value;
            const condition = document.getElementById('patient-condition').value;
            const contact = document.getElementById('patient-contact').value;

            try {
                if (isUpdating && updateType === 'patient') {
                    await updateDoc(doc(db, 'patients', updateId), {
                        name,
                        age,
                        gender,
                        condition,
                        contact,
                        updatedAt: serverTimestamp()
                    });
                    showMessage('Patient updated successfully!', 'success');
                    addPatientBtn.textContent = 'Add Patient';
                } else {
                    await addDoc(collection(db, 'patients'), {
                        name,
                        age,
                        gender,
                        condition,
                        contact,
                        createdAt: serverTimestamp()
                    });
                    showMessage('Patient added successfully!', 'success');
                }
                document.getElementById('patient-form').reset();
                isUpdating = false;
                updateId = null;
                updateType = null;
                fetchPatients(); // Refresh the list
            } catch (error) {
                showMessage('Error adding/updating patient: ' + error.message, 'error');
            }
        });
    }

    // Handle posting or updating operation details
    if (postOperationBtn) {
        postOperationBtn.addEventListener('click', async () => {
            const operationDate = document.getElementById('operation-date').value;
            const operationTime = document.getElementById('operation-time').value;
            const otId = document.getElementById('ot-id').value;
            const anesthesiaType = document.getElementById('anesthesia-type').value;
            const anesthesiologistName = document.getElementById('anesthesiologist-name').value;
            const medic = document.getElementById('medic').value;
            const nurses = document.getElementById('nurses').value;
            const prePostEvents = document.getElementById('pre-post-events').value;
            const surgicalReports = document.getElementById('surgical-reports').files;
            const remarks = document.getElementById('remarks').value;
            const specialDrugs = document.getElementById('special-drugs').value;

            const operationData = {
                operationDate,
                operationTime,
                otId,
                anesthesiaType,
                anesthesiologistName,
                medic,
                nurses,
                prePostEvents,
                surgicalReports: Array.from(surgicalReports).map(file => file.name),
                remarks,
                specialDrugs,
                updatedAt: serverTimestamp()
            };

            try {
                if (isUpdating && updateType === 'operation') {
                    await updateDoc(doc(db, 'operations', updateId), operationData);
                    showMessage('Operation details updated successfully!', 'success');
                    postOperationBtn.textContent = 'Post Operation Details';
                } else {
                    await addDoc(collection(db, 'operations'), { ...operationData, createdAt: serverTimestamp() });
                    showMessage('Operation details posted successfully!', 'success');
                }
                document.getElementById('post-operation-form').reset(); // Clear form
                isUpdating = false;
                updateId = null;
                updateType = null;
                fetchOperations(); // Refresh the list
            } catch (error) {
                showMessage('Error posting operation details: ' + error.message, 'error');
            }
        });
    }

    // Function to show messages
    function showMessage(message, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = message;
        messageDiv.className = type;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    // Fetch and display doctors with edit and delete options
    async function fetchDoctors() {
        const doctorList = document.getElementById('doctor-list');
        doctorList.innerHTML = ''; // Clear the list
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        querySnapshot.forEach(doc => {
            const doctor = doc.data();
            const div = document.createElement('div');
            div.innerHTML = `
                <div>
                    <strong>Name:</strong> ${doctor.name}<br>
                    <strong>Qualification:</strong> ${doctor.qualification}<br>
                    <strong>Specialty:</strong> ${doctor.specialty}<br>
                    <strong>Experience:</strong> ${doctor.experience}<br>
                    <strong>Availability:</strong> ${doctor.availability}<br>
                    
                    <button type="button" onclick="editDoctor('${doc.id}')">Edit</button>
                    <button type="button" onclick="deleteDoctor('${doc.id}')">Delete</button>
                </div>
            `;
            doctorList.appendChild(div);
        });
    }

    // Fetch and display patients with edit and delete options
    async function fetchPatients() {
        const patientList = document.getElementById('patient-list');
        patientList.innerHTML = ''; // Clear the list
        const querySnapshot = await getDocs(collection(db, 'patients'));
        querySnapshot.forEach(doc => {
            const patient = doc.data();
            const div = document.createElement('div');
            div.innerHTML = `
                <div>
                    <strong>Name:</strong> ${patient.name}<br>
                    <strong>Age:</strong> ${patient.age}<br>
                    <strong>Gender:</strong> ${patient.gender}<br>
                    <strong>Condition:</strong> ${patient.condition}<br>
                    <strong>Contact:</strong> ${patient.contact}<br>

                    <button type="button" onclick="editPatient('${doc.id}')">Edit</button>
                    <button type="button" onclick="deletePatient('${doc.id}')">Delete</button>
                </div>
            `;
            patientList.appendChild(div);
        });
    }

    // Fetch and display operations with edit and delete options
    async function fetchOperations() {
        const operationList = document.getElementById('operation-list');
        operationList.innerHTML = ''; // Clear the list
        const querySnapshot = await getDocs(collection(db, 'operations'));
        querySnapshot.forEach(doc => {
            const operation = doc.data();
            const div = document.createElement('div');
            div.innerHTML = `
                <div>
                    <strong>Date of Surgery:</strong> ${operation.operationDate} <br>
                    <strong>Time of Surgery:</strong> ${operation.operationTime} <br>
                    <strong>OT ID:</strong> ${operation.otId} <br>
                    <strong>Type of Anesthesia:</strong> ${operation.anesthesiaType} <br>
                    <strong>Anesthesiologist Name:</strong> ${operation.anesthesiologistName} <br>
                    <strong>Medic:</strong> ${operation.medic} <br>
                    <strong>Nurses:</strong> ${operation.nurses} <br>
                    <strong>Pre/Post Operative Events:</strong> ${operation.prePostEvents} <br>
                    <strong>Surgical Reports:</strong> ${operation.surgicalReports.join(', ')} <br>
                    <strong>Remarks:</strong> ${operation.remarks} <br>
                    <strong>Special Drugs:</strong> ${operation.specialDrugs} <br>
                    <button type="button" onclick="editOperation('${doc.id}')">Edit</button>
                    <button type="button" onclick="deleteOperation('${doc.id}')">Delete</button>
                </div>
                <hr>
            `;
            operationList.appendChild(div);
        });
    }

    // Function to edit doctor
    window.editDoctor = async (id) => {
        try {
            const docRef = doc(db, 'doctors', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const doctor = docSnap.data();
                document.getElementById('doctor-name').value = doctor.name;
                document.getElementById('doctor-qualification').value = doctor.qualification;
                document.getElementById('doctor-specialty').value = doctor.specialty;
                document.getElementById('doctor-experience').value = doctor.experience;
                document.getElementById('doctor-availability').value = doctor.availability;

                addDoctorBtn.textContent = 'Update Doctor';
                isUpdating = true;
                updateId = id;
                updateType = 'doctor';
            }
        } catch (error) {
            showMessage('Error fetching doctor details: ' + error.message, 'error');
        }
    };

    // Function to delete doctor
    window.deleteDoctor = async (id) => {
        try {
            await deleteDoc(doc(db, 'doctors', id));
            showMessage('Doctor deleted successfully!', 'success');
            fetchDoctors(); // Refresh the list
        } catch (error) {
            showMessage('Error deleting doctor: ' + error.message, 'error');
        }
    };

    // Function to edit patient
    window.editPatient = async (id) => {
        try {
            const docRef = doc(db, 'patients', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const patient = docSnap.data();
                document.getElementById('patient-name').value = patient.name;
                document.getElementById('patient-age').value = patient.age;
                document.getElementById('patient-gender').value = patient.gender;
                document.getElementById('patient-condition').value = patient.condition;
                document.getElementById('patient-contact').value = patient.contact;
                addPatientBtn.textContent = 'Update Patient';
                isUpdating = true;
                updateId = id;
                updateType = 'patient';
            }
        } catch (error) {
            showMessage('Error fetching patient details: ' + error.message, 'error');
        }
    };

    // Function to delete patient
    window.deletePatient = async (id) => {
        try {
            await deleteDoc(doc(db, 'patients', id));
            showMessage('Patient deleted successfully!', 'success');
            fetchPatients(); // Refresh the list
        } catch (error) {
            showMessage('Error deleting patient: ' + error.message, 'error');
        }
    };

    // Function to edit operation
    window.editOperation = async (id) => {
        try {
            const docRef = doc(db, 'operations', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const operation = docSnap.data();
                document.getElementById('operation-date').value = operation.operationDate;
                document.getElementById('operation-time').value = operation.operationTime;
                document.getElementById('ot-id').value = operation.otId;
                document.getElementById('anesthesia-type').value = operation.anesthesiaType;
                document.getElementById('anesthesiologist-name').value = operation.anesthesiologistName;
                document.getElementById('medic').value = operation.medic;
                document.getElementById('nurses').value = operation.nurses;
                document.getElementById('pre-post-events').value = operation.prePostEvents;
                document.getElementById('remarks').value = operation.remarks;
                document.getElementById('special-drugs').value = operation.specialDrugs;
                postOperationBtn.textContent = 'Update Operation Details';
                isUpdating = true;
                updateId = id;
                updateType = 'operation';
            }
        } catch (error) {
            showMessage('Error fetching operation details: ' + error.message, 'error');
        }
    };

    // Function to delete operation
    window.deleteOperation = async (id) => {
        try {
            await deleteDoc(doc(db, 'operations', id));
            showMessage('Operation deleted successfully!', 'success');
            fetchOperations(); // Refresh the list
        } catch (error) {
            showMessage('Error deleting operation: ' + error.message, 'error');
        }
    };

    // Initial fetch
    fetchDoctors();
    fetchPatients();
    fetchOperations();
});

