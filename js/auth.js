// Authentication JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    var user = userCredential.user;
                    console.log('User logged in:', user);
                    // Redirect to the appropriate dashboard
                    window.location.href = 'user.html';
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.error('Login error:', errorCode, errorMessage);
                });
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    var user = userCredential.user;
                    console.log('User registered:', user);
                    // Redirect to the user dashboard
                    window.location.href = 'user.html';
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.error('Registration error:', errorCode, errorMessage);
                });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            firebase.auth().signOut().then(() => {
                // Sign-out successful.
                console.log('User logged out');
                window.location.href = 'index.html';
            }).catch((error) => {
                // An error happened.
                console.error('Logout error:', error);
            });
        });
    }
});
