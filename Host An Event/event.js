function validateEvent(event) {
	event.preventDefault();

	const eventName = document.getElementById('eventname').value.trim();
	const startDate = document.getElementById('startdate').value;
	const location = document.getElementById('location').value.trim();
	const contact = document.getElementById('contactinfo').value.trim();
	const sponsor = document.getElementById('sponsorname').value.trim();
	const errorMessage = document.getElementById('errorMessage');

	if (eventName === "" || startDate === "" || location === "" || contact === "" || sponsor === "") {
		errorMessage.style.display = "block";
		return false;
	}

	alert("Event submitted successfully!");
	errorMessage.style.display = "none";
	return false;
}