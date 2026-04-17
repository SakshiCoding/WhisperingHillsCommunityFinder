function getLoggedInUser() {
	return localStorage.getItem('whcfUser');
}

function logoutUser() {
	localStorage.removeItem('whcfUser');
	window.location.href = '../Login Page/index.html';
}

function replaceAuthLinks() {
	var header = document.getElementById('header');
	if (!header) {
		return;
	}

	var user = getLoggedInUser();
	if (!user) {
		return;
	}

	var links = header.getElementsByTagName('a');
	var logInLink = null;
	var signUpLink = null;
	for (var i = 0; i < links.length; i += 1) {
		var label = links[i].textContent.trim().toLowerCase();
		if (label === 'log in') {
			logInLink = links[i];
		}
		if (label === 'sign up') {
			signUpLink = links[i];
		}
	}

	if (logInLink) {
		logInLink.parentNode.removeChild(logInLink);
	}
	if (signUpLink) {
		signUpLink.parentNode.removeChild(signUpLink);
	}

	var userMenu = document.createElement('div');
	userMenu.style.display = 'inline-block';
	userMenu.style.position = 'relative';
	userMenu.style.marginLeft = '12px';
	userMenu.style.marginRight = '5px';

	var userButton = document.createElement('button');
	userButton.type = 'button';
	userButton.textContent = user + ' ▼';
	userButton.style.background = 'transparent';
	userButton.style.border = 'none';
	userButton.style.color = '#FFFFFF';
	userButton.style.fontWeight = 'bold';
	userButton.style.cursor = 'pointer';
	userButton.style.padding = '0';
	userButton.style.lineHeight = '25px';
	userButton.style.fontSize = '12px';

	var menu = document.createElement('div');
	menu.style.display = 'none';
	menu.style.position = 'absolute';
	menu.style.right = '0';
	menu.style.top = '25px';
	menu.style.minWidth = '120px';
	menu.style.background = '#FFFFFF';
	menu.style.border = '1px solid #ccc';
	menu.style.zIndex = '1000';

	var accountItem = document.createElement('a');
	accountItem.href = '#';
	accountItem.textContent = 'Account';
	accountItem.style.display = 'block';
	accountItem.style.padding = '8px 10px';
	accountItem.style.color = '#9B1313';
	accountItem.style.textDecoration = 'none';
	accountItem.addEventListener('click', function (event) {
		event.preventDefault();
		menu.style.display = 'none';
	});

	var logoutItem = document.createElement('a');
	logoutItem.href = '#';
	logoutItem.textContent = 'Log Out';
	logoutItem.style.display = 'block';
	logoutItem.style.padding = '8px 10px';
	logoutItem.style.color = '#9B1313';
	logoutItem.style.textDecoration = 'none';
	logoutItem.addEventListener('click', function (event) {
		event.preventDefault();
		logoutUser();
	});

	var subscribersItem = null;
	if (user === 'admin1') {
		subscribersItem = document.createElement('a');
		subscribersItem.href = '../Newsletter Subscribers/index.html';
		subscribersItem.textContent = 'View Current Newsletter Subscribers';
		subscribersItem.style.display = 'block';
		subscribersItem.style.padding = '8px 10px';
		subscribersItem.style.color = '#9B1313';
		subscribersItem.style.textDecoration = 'none';
	}

	userButton.addEventListener('click', function () {
		menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
	});

	document.addEventListener('click', function (event) {
		if (!userMenu.contains(event.target)) {
			menu.style.display = 'none';
		}
	});

	menu.appendChild(accountItem);
	if (subscribersItem) {
		menu.appendChild(subscribersItem);
	}
	menu.appendChild(logoutItem);
	userMenu.appendChild(userButton);
	userMenu.appendChild(menu);
	header.appendChild(userMenu);
}

document.addEventListener('DOMContentLoaded', replaceAuthLinks);
