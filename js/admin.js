// Admin dashboard JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    const createServiceBtn = document.getElementById('create-service-btn');
    const servicesList = document.getElementById('services-list');
    const applicationsList = document.getElementById('applications-list');
    const serviceNameInput = document.getElementById('service-name');
    const serviceDescriptionInput = document.getElementById('service-description');
    let selectedServiceId = null;

    const db = firebase.firestore();

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
    const fetchServices = () => {
        db.collection('services').get()
            .then(querySnapshot => {
                const services = [];
                querySnapshot.forEach(doc => {
                    services.push({ id: doc.id, ...doc.data() });
                });
                renderServices(services);
            })
            .catch(error => {
                console.error("Error fetching services: ", error);
            });
    };

    // Initial fetch
    fetchServices();

    // Create or Update a service
    createServiceBtn.addEventListener('click', () => {
        const serviceName = serviceNameInput.value;
        const serviceDescription = serviceDescriptionInput.value;

        if (selectedServiceId) {
            // Update existing service
            db.collection('services').doc(selectedServiceId).update({
                name: serviceName,
                description: serviceDescription
            })
            .then(() => {
                console.log("Service updated successfully!");
                fetchServices();
                resetForm();
            })
            .catch(error => {
                console.error("Error updating service: ", error);
            });
        } else {
            // Create new service
            db.collection('services').add({
                name: serviceName,
                description: serviceDescription
            })
            .then(() => {
                console.log("Service created successfully!");
                fetchServices();
                resetForm();
            })
            .catch(error => {
                console.error("Error creating service: ", error);
            });
        }
    });

    // Delete a service
    const deleteService = (serviceId) => {
        db.collection('services').doc(serviceId).delete()
            .then(() => {
                console.log("Service deleted successfully!");
                fetchServices();
            })
            .catch(error => {
                console.error("Error deleting service: ", error);
            });
    };

    // Function to render applications
    const renderApplications = (applications) => {
        applicationsList.innerHTML = '';
        applications.forEach(application => {
            const applicationElement = document.createElement('div');
            // Fetch service and user details for each application
            db.collection('services').doc(application.serviceId).get().then(serviceDoc => {
                if (serviceDoc.exists) {
                    db.collection('users').doc(application.userId).get().then(userDoc => {
                        if (userDoc.exists) {
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
            select.addEventListener('change', (e) => {
                const applicationId = e.target.dataset.id;
                const newStatus = e.target.value;
                updateApplicationStatus(applicationId, newStatus);
            });
        });
    };

    // Fetch and render all applications
    const fetchApplications = () => {
        db.collection('applications').get()
            .then(querySnapshot => {
                const applications = [];
                querySnapshot.forEach(doc => {
                    applications.push({ id: doc.id, ...doc.data() });
                });
                renderApplications(applications);
            })
            .catch(error => {
                console.error("Error fetching applications: ", error);
            });
    };

    // Initial fetch
    fetchApplications();

    // Update application status
    const updateApplicationStatus = (applicationId, newStatus) => {
        db.collection('applications').doc(applicationId).update({
            status: newStatus
        })
        .then(() => {
            console.log("Application status updated successfully!");
            fetchApplications();
        })
        .catch(error => {
            console.error("Error updating application status: ", error);
        });
    };

    // Reset the create/update form
    const resetForm = () => {
        selectedServiceId = null;
        serviceNameInput.value = '';
        serviceDescriptionInput.value = '';
        createServiceBtn.textContent = 'Create Service';
    };

});
