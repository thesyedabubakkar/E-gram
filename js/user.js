import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { collection, getDocs, addDoc, doc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const servicesList = document.getElementById('services-list');
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');
    const myApplicationsList = document.getElementById('my-applications-list');

    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
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
            button.addEventListener('click', async (e) => {
                const serviceId = e.target.dataset.id;
                await applyForService(serviceId);
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

    // Search functionality
    searchBtn.addEventListener('click', async () => {
        const searchTerm = searchBar.value.toLowerCase();
        const querySnapshot = await getDocs(collection(db, 'services'));
        const services = [];
        querySnapshot.forEach(doc => {
            const serviceName = doc.data().name.toLowerCase();
            if (serviceName.includes(searchTerm)) {
                services.push({ id: doc.id, ...doc.data() });
            }
        });
        renderServices(services);
    });

    // Apply for a service
    const applyForService = async (serviceId) => {
        if (currentUser) {
            await addDoc(collection(db, 'applications'), {
                userId: currentUser.uid,
                serviceId: serviceId,
                status: 'pending'
            });
            console.log("Application submitted successfully!");
            fetchMyApplications();
        }
    };

    // Function to render my applications
    const renderMyApplications = (applications) => {
        myApplicationsList.innerHTML = '';
        applications.forEach(application => {
            const applicationElement = document.createElement('div');
            // Fetch service details for each application
            getDoc(doc(db, 'services', application.serviceId)).then(serviceDoc => {
                if (serviceDoc.exists()) {
                    applicationElement.innerHTML = `
                        <h3>${serviceDoc.data().name}</h3>
                        <p>Status: ${application.status}</p>
                    `;
                    myApplicationsList.appendChild(applicationElement);
                }
            });
        });
    };

    // Fetch and render my applications
    const fetchMyApplications = async () => {
        if (currentUser) {
            const q = query(collection(db, 'applications'), where('userId', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            const applications = [];
            querySnapshot.forEach(doc => {
                applications.push({ id: doc.id, ...doc.data() });
            });
            renderMyApplications(applications);
        }
    };

});