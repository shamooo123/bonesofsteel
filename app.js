/* app.js */

// 1. Initialize PocketBase
const pb = new PocketBase('https://YOUR-APP.onrender.com'); 

// 2. Check Authentication on Page Load
document.addEventListener('DOMContentLoaded', () => {
    
    // If we are on the dashboard but NOT logged in, kick user out
    if (window.location.pathname.includes('dashboard.html')) {
        if (!pb.authStore.isValid) {
            window.location.href = 'login.html';
        } else {
            // Display User Name
            const userEl = document.getElementById('user-name');
            if(userEl) userEl.innerText = pb.authStore.model.email;
        }
    }
});

// 3. Login / Signup Logic
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    let isLoginMode = true;

    // Toggle between Login and Sign Up
    document.getElementById('toggle-auth').addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        document.getElementById('form-title').innerText = isLoginMode ? 'Member Login' : 'Create Account';
        loginBtn.innerText = isLoginMode ? 'Log In' : 'Sign Up';
    });

    // Handle Button Click
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');

        try {
            if (isLoginMode) {
                // Log In
                await pb.collection('users').authWithPassword(email, pass);
                window.location.href = 'dashboard.html';
            } else {
                // Sign Up
                const data = { "email": email, "password": pass, "passwordConfirm": pass };
                await pb.collection('users').create(data);
                
                // Automatically log them in after creating account
                await pb.collection('users').authWithPassword(email, pass);
                
                // REDIRECT TO PAYMENT (Stripe)
                // Replace this URL with your actual Stripe Payment Link
                window.location.href = 'https://buy.stripe.com/YOUR_STRIPE_LINK'; 
            }
        } catch (err) {
            errorMsg.style.display = 'block';
            errorMsg.innerText = "Error: " + err.message;
        }
    });
}

// 4. Logout Function
function logout() {
    pb.authStore.clear();
    window.location.href = 'index.html';
}
