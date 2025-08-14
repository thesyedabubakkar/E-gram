import { db } from './firebase-config.js';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const createServiceBtn = document.getElementById('create-service-btn');
    const servicesList = document.getElementById('services-list');
    const applicationsList = document.getElementById('applications-list');
    const serviceNameInput = document.getElementById('service-name');
    const serviceDescriptionInput = document.getElementById('service-description');
    let selectedServiceId = null;

    // Function to render services
    const renderServices = (services) => {
        servicesList.innerHTML = '';
        services.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.innerHTML = `
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <button class="update-btn" data-id="${service.id}" data-name="${service.name}" data-description="${service.description}">Update</button>
                <button class="delete-btn" data-id="${service.id}">Delete</button>
            `;
            servicesList.appendChild(serviceElement);
        });

        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const serviceId = e.target.dataset.id;
                deleteService(serviceId);
            });
        });

        // Add event listeners to update buttons
        const updateButtons = document.querySelectorAll('.update-btn');
        updateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                selectedServiceId = e.target.dataset.id;
                serviceNameInput.value = e.target.dataset.name;
                serviceDescriptionInput.value = e.target.dataset.description;
                createServiceBtn.textContent = 'Update Service';
            });
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

    // Create or Update a service
    createServiceBtn.addEventListener('click', async () => {
        const serviceName = serviceNameInput.value;
        const serviceDescription = serviceDescriptionInput.value;

        if (selectedServiceId) {
            // Update existing service
            await updateDoc(doc(db, 'services', selectedServiceId), {
                name: serviceName,
                description: serviceDescription
            });
            console.log("Service updated successfully!");
        } else {
            // Create new service
            await addDoc(collection(db, 'services'), {
                name: serviceName,
                description: serviceDescription
            });
            console.log("Service created successfully!");
        }
        fetchServices();
        resetForm();
    });

    // Delete a service
    const deleteService = async (serviceId) => {
        await deleteDoc(doc(db, 'services', serviceId));
        console.log("Service deleted successfully!");
        fetchServices();
    };

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

    // Reset the create/update form
    const resetForm = () => {
        selectedServiceId = null;
        serviceNameInput.value = '';
        serviceDescriptionInput.value = '';
        createServiceBtn.textContent = 'Create Service';
    };

});