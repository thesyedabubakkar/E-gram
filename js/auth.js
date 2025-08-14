import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log('User logged in:', user);
                    window.location.href = 'user.html';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error('Login error:', errorCode, errorMessage);
                });
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        role: 'user'
                    })
                    .then(() => {
                        console.log("User added to firestore");
                        window.location.href = 'user.html';
                    })
                    .catch((error) => {
                        console.error("Error adding user to firestore: ", error);
                    });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error('Registration error:', errorCode, errorMessage);
                });
        });
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        role: 'user'
                    }, { merge: true })
                    .then(() => {
                        console.log("User added/updated in firestore via Google");
                        window.location.href = 'user.html';
                    })
                    .catch((error) => {
                        console.error("Error adding/updating user to firestore via Google: ", error);
                    });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error('Google login error:', errorCode, errorMessage);
                });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                console.log('User logged out');
                window.location.href = 'index.html';
            }).catch((error) => {
                console.error('Logout error:', error);
            });
        });
    }
});