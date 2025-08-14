import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in.
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userRole = docSnap.data().role;
                if (userRole === 'admin') {
                    window.location.href = 'admin.html';
                } else if (userRole === 'staff') {
                    window.location.href = 'staff.html';
                } else {
                    window.location.href = 'user.html';
                }
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    } else {
        // User is signed out.
        console.log('User is signed out');
    }
});