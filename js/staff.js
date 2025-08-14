// Staff dashboard JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    const servicesList = document.getElementById('services-list');
    const applicationsList = document.getElementById('applications-list');

    const db = firebase.firestore();

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

});
