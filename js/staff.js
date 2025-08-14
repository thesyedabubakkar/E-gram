import { db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const servicesList = document.getElementById('services-list');
    const applicationsList = document.getElementById('applications-list');

    // Function to render services
    const renderServices = (services) => {
        servicesList.innerHTML = '';
        services.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.innerHTML = `
                <h3>${service.name}</h3>
                <p>${service.description}</p>
            `;
            servicesList.appendChild(serviceElement);
        });
    };

    // Fetch and render all services
    const fetchServices = async () => {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const services = [];
        querySnapshot.forEach(doc => {
            services.push({ id: doc.id, ...doc.data() });
        });
        renderServices(services);
    };

    // Initial fetch
    fetchServices();

    // Function to render applications
    const renderApplications = (applications) => {
        applicationsList.innerHTML = '';
        applications.forEach(application => {
            const applicationElement = document.createElement('div');
            // Fetch service and user details for each application
            getDoc(doc(db, 'services', application.serviceId)).then(serviceDoc => {
                if (serviceDoc.exists()) {
                    getDoc(doc(db, 'users', application.userId)).then(userDoc => {
                        if (userDoc.exists()) {
                            applicationElement.innerHTML = `
                                <h3>${serviceDoc.data().name}</h3>
                                <p>Applied by: ${userDoc.data().email}</p>
                                <p>Status: ${application.status}</p>
                                <select class="status-select" data-id="${application.id}">
                                    <option value="pending" ${application.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="approved" ${application.status === 'approved' ? 'selected' : ''}>Approved</option>
                                    <option value="rejected" ${application.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                                </select>
                            `;
                            applicationsList.appendChild(applicationElement);
                        }
                    });
                }
            });
        });

        // Add event listeners to status select
        const statusSelects = document.querySelectorAll('.status-select');
        statusSelects.forEach(select => {
            select.addEventListener('change', async (e) => {
                const applicationId = e.target.dataset.id;
                const newStatus = e.target.value;
                await updateApplicationStatus(applicationId, newStatus);
            });
        });
    };

    // Fetch and render all applications
    const fetchApplications = async () => {
        const querySnapshot = await getDocs(collection(db, 'applications'));
        const applications = [];
        querySnapshot.forEach(doc => {
            applications.push({ id: doc.id, ...doc.data() });
        });
        renderApplications(applications);
    };

    // Initial fetch
    fetchApplications();

    // Update application status
    const updateApplicationStatus = async (applicationId, newStatus) => {
        await updateDoc(doc(db, 'applications', applicationId), {
            status: newStatus
        });
        console.log("Application status updated successfully!");
        fetchApplications();
    };

});