const VALID_USERNAMES = ['user1', 'admin1'];
const VALID_PASSWORD = 'CNIT280';

function validateLogin(event) {
	event.preventDefault();

	const username = document.getElementById('username').value.trim();
	const password = document.getElementById('password').value;
	const errorMessage = document.getElementById('errorMessage');

	if (VALID_USERNAMES.includes(username) && password === VALID_PASSWORD) {
		localStorage.setItem('whcfUser', username);
		window.location.href = '../Home Page/index.html';
		return false;
	}

	errorMessage.style.display = 'block';
	return false;
}
