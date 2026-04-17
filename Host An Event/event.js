var EXTERNAL_OPPORTUNITY_DEFAULT_ERROR = 'Please fill in all required fields correctly.';
var EXTERNAL_OPPORTUNITY_EXPIRED_DATE_ERROR = 'The provided date has expired. Please enter a current date.';

function validateEvent(event) {
	event.preventDefault();

	const eventName = document.getElementById('eventname').value.trim();
	const startDate = document.getElementById('startdate').value;
	const location = document.getElementById('location').value.trim();
	const contact = document.getElementById('contactinfo').value.trim();
	const sponsor = document.getElementById('sponsorname').value.trim();
	const notesEl = document.getElementById('notes');
	const notes = notesEl ? notesEl.value.trim() : '';

	const orgnameEl = document.getElementById('orgname');
	const isExternalOpportunityForm = orgnameEl !== null;

	if (isExternalOpportunityForm) {
		const orgname = orgnameEl.value.trim();
		const extError = document.getElementById('externalErrorMessage');
		if (orgname === '' || eventName === '' || startDate === '' || location === '' || contact === '' || sponsor === '') {
			if (extError) {
				extError.textContent = EXTERNAL_OPPORTUNITY_DEFAULT_ERROR;
				extError.style.display = 'block';
			}
			return false;
		}
		if (typeof whcfIsStartDateBeforeToday === 'function' && whcfIsStartDateBeforeToday(startDate)) {
			if (extError) {
				extError.textContent = EXTERNAL_OPPORTUNITY_EXPIRED_DATE_ERROR;
				extError.style.display = 'block';
			}
			return false;
		}
		if (typeof addStoredJobOpportunity === 'function') {
			addStoredJobOpportunity({
				title: eventName,
				organization: orgname,
				location: location,
				startDate: startDate,
				contact: contact,
				sponsor: sponsor,
				notes: notes
			});
		}
		if (extError) {
			extError.textContent = EXTERNAL_OPPORTUNITY_DEFAULT_ERROR;
			extError.style.display = 'none';
		}
		alert('Opportunity submitted successfully! It will appear on the Job Opportunities page.');
		event.target.reset();
		return false;
	}

	const errorMessage = document.getElementById('errorMessage');

	if (eventName === '' || startDate === '' || location === '' || contact === '' || sponsor === '') {
		errorMessage.style.display = 'block';
		return false;
	}

	alert('Event submitted successfully!');
	errorMessage.style.display = 'none';
	return false;
}
