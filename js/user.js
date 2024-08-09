import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';
import { db } from './config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    const auth = getAuth();
    const logoutBtn = document.getElementById('logout-btn');

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

    async function fetchDoctorDetails() {
        const doctorDetailsList = document.getElementById('doctor-details-list');
        if (!doctorDetailsList) return;
        
        try {
            const querySnapshot = await getDocs(collection(db, 'doctors'));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const doctorElement = document.createElement('div');
                doctorElement.classList.add('doctor-details');
                doctorElement.innerHTML = `
                    <p>Name: ${data.name}</p>
                    <p>Qualification: ${data.qualification}</p>
                    <p>Specialty: ${data.specialty}</p>
                    <p>Experience: ${data.experience}</p>
                    <p>Availability: ${data.availability}
                `;
                doctorDetailsList.appendChild(doctorElement);
            });
        } catch (error) {
            console.error('Error fetching doctor details:', error.message);
        }
    }

    async function fetchSurgicalDetails() {
        const surgicalDetailsList = document.getElementById('surgical-details-list');
        if (!surgicalDetailsList) return;
        
        try {
            const querySnapshot = await getDocs(collection(db, 'operations'));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const operationElement = document.createElement('div');
                operationElement.classList.add('operation-details');
                operationElement.innerHTML = `
                    <p>Date: ${data.operationDate}</p>
                    <p>Time: ${data.operationTime}</p>
                    <p>OT ID: ${data.otId}</p>
                    <p>Anesthesia Type: ${data.anesthesiaType}</p>
                    <p>Anesthesiologist: ${data.anesthesiologistName}</p>
                    <p>Medic: ${data.medic}</p>
                    <p>Nurses: ${data.nurses}</p>
                    <p>Pre/Post Operative Events: ${data.prePostEvents}</p>
                    <p>Remarks: ${data.remarks}</p>
                    <p>Special Drugs: ${data.specialDrugs}</p>
                    <p>Surgical Reports: ${data.surgicalReports.join(', ')}</p>
                `;
                surgicalDetailsList.appendChild(operationElement);
            });
        } catch (error) {
            console.error('Error fetching surgical details:', error.message);
        }
    }

    fetchDoctorDetails();
    fetchSurgicalDetails();
});
