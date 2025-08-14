
// User dashboard JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    const servicesList = document.getElementById('services-list');
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');
    const myApplicationsList = document.getElementById('my-applications-list');

    const db = firebase.firestore();
    const auth = firebase.auth();

    let currentUser = null;

    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            fetchServices();
            fetchMyApplications();
        } else {
            currentUser = null;
        }
    });

    // Function to render services
    const renderServices = (services) => {
        servicesList.innerHTML = '';
        services.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.innerHTML = `
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <button class="apply-btn" data-id="${service.id}">Apply</button>
            `;
            servicesList.appendChild(serviceElement);
        });

        // Add event listeners to apply buttons
        const applyButtons = document.querySelectorAll('.apply-btn');
        applyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const serviceId = e.target.dataset.id;
                applyForService(serviceId);
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

    // Search functionality
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchBar.value.toLowerCase();
        db.collection('services').get()
            .then(querySnapshot => {
                const services = [];
                querySnapshot.forEach(doc => {
                    const serviceName = doc.data().name.toLowerCase();
                    if (serviceName.includes(searchTerm)) {
                        services.push({ id: doc.id, ...doc.data() });
                    }
                });
                renderServices(services);
            })
            .catch(error => {
                console.error("Error searching services: ", error);
            });
    });

    // Apply for a service
    const applyForService = (serviceId) => {
        if (currentUser) {
            db.collection('applications').add({
                userId: currentUser.uid,
                serviceId: serviceId,
                status: 'pending'
            })
            .then(() => {
                console.log("Application submitted successfully!");
                fetchMyApplications();
            })
            .catch(error => {
                console.error("Error submitting application: ", error);
            });
        }
    };

    // Function to render my applications
    const renderMyApplications = (applications) => {
        myApplicationsList.innerHTML = '';
        applications.forEach(application => {
            const applicationElement = document.createElement('div');
            // Fetch service details for each application
            db.collection('services').doc(application.serviceId).get().then(doc => {
                if (doc.exists) {
                    applicationElement.innerHTML = `
                        <h3>${doc.data().name}</h3>
                        <p>Status: ${application.status}</p>
                    `;
                    myApplicationsList.appendChild(applicationElement);
                }
            });
        });
    };

    // Fetch and render my applications
    const fetchMyApplications = () => {
        if (currentUser) {
            db.collection('applications').where('userId', '==', currentUser.uid).get()
                .then(querySnapshot => {
                    const applications = [];
                    querySnapshot.forEach(doc => {
                        applications.push({ id: doc.id, ...doc.data() });
                    });
                    renderMyApplications(applications);
                })
                .catch(error => {
                    console.error("Error fetching applications: ", error);
                });
        }
    };

});

