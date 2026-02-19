const VALID_USERNAME = 'user1';
const VALID_PASSWORD = 'CNIT280';

function validateLogin(event) {
	event.preventDefault();

	const username = document.getElementById('username').value.trim();
	const password = document.getElementById('password').value;
	const errorMessage = document.getElementById('errorMessage');

	if (username === VALID_USERNAME && password === VALID_PASSWORD) {
		window.location.href = '../Home Page/index.html';
		return false;
	}

	errorMessage.style.display = 'block';
	return false;
}
