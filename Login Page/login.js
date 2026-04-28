const VALID_USERNAMES = ['user1', 'admin1', 'recruiter1', 'volunteer1'];
const USERS = {
	'user1': { password: 'CNIT280', label: 'user1 (Client)'},
	'admin1': { password: 'CNIT280', label: 'admin1 (Administrator)'},
	'recruiter1': { password: 'CNIT280', label: 'recruiter1 (Recruiter)'},
	'volunteer1': { password: 'CNIT280', label: 'volunteer1(Volunteer) '},
};

const VALID_USERNAME = 'user1';
const VALID_PASSWORD = 'CNIT280';

function validateLogin(e) {
    e.preventDefault();
    
    const userIn = document.getElementById('username').value.toLowerCase().trim();
    const passIn = document.getElementById('password').value;

    // 1. Get the new users from the Sign Up database
    const userDb = JSON.parse(localStorage.getItem('userDatabase')) || {};

    // 2. Keep your hard-coded users as a fallback
    const HARDCODED_USERS = {
        'user1': { password: 'CNIT280', label: 'user1 (Client)'},
        'admin1': { password: 'CNIT280', label: 'admin1 (Administrator)'},
        'recruiter1': { password: 'CNIT280', label: 'recruiter1 (Recruiter)'},
        'volunteer1': { password: 'CNIT280', label: 'volunteer1 (Volunteer)'},
    };

    let foundUser = null;
    let userLabel = "";

    // 3. Check hard-coded users first
    if (HARDCODED_USERS[userIn] && HARDCODED_USERS[userIn].password === passIn) {
        foundUser = HARDCODED_USERS[userIn];
        userLabel = foundUser.label;
    } 
    // 4. If not found, check the Sign Up database
    else if (userDb[userIn] && userDb[userIn].password === passIn) {
        foundUser = userDb[userIn];
        // Format the label like "username (Role)"
        const role = foundUser.role.charAt(0).toUpperCase() + foundUser.role.slice(1);
        userLabel = `${userIn} (${role})`;
    }

    // 5. Logic to log in or reject
    if (foundUser) {
        sessionStorage.setItem('loggedInUser', userLabel);
        
        setTimeout(() => {
            window.location.href = '../Home Page/index.html';
        }, 100); 
    } else {
        alert("Invalid username or password.");
    }
}
