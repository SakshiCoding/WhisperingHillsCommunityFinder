const USERS = {
	'user1': { password: 'CNIT280', label: 'user1 (Client)'},
	'admin1': { password: 'CNIT280', label: 'admin1 (Administrator)'}
};


function validateLogin(event) {
	event.preventDefault();

	const username = document.getElementById('username').value.trim();
	const password = document.getElementById('password').value;
	const errorMessage = document.getElementById('errorMessage');

	if (USERS[username] && USERS[username].password === password) {
		sessionStorage.setItem('loggedInUser', USERS[username].label)
		window.location.href = '../Home Page/index.html';
		return false;
	
	}

	errorMessage.style.display = 'block';
	return false;
}
