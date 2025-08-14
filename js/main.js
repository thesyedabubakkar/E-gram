// Main JavaScript file

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        const db = firebase.firestore();
        const userRef = db.collection('users').doc(user.uid);
        userRef.get().then((doc) => {
            if (doc.exists) {
                const userRole = doc.data().role;
                if (userRole === 'admin') {
                    window.location.href = 'admin.html';
                } else if (userRole === 'staff') {
                    window.location.href = 'staff.html';
                } else {
                    window.location.href = 'user.html';
                }
            } else {
                // doc.data() will be undefined in this case
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
