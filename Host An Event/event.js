function validateEvent(e) {
    e.preventDefault(); 

    // 1. Get the current logged-in user from the session
    const userLabel = sessionStorage.getItem('loggedInUser') || "Guest";
    // Extract just the username (e.g., "recruiter1")
    const currentUsername = userLabel.split(' ')[0].toLowerCase();

    try {
        const getVal = (id) => {
            const el = document.getElementById(id);
            return el ? el.value : "N/A";
        };

		const startVal = getVal('startdate'); 
        const endVal = getVal('oppEndDate');

		// Validation: Ensure at least a start date exists
		if (!startVal) {
			alert("Please select a start date.");
			return;
		}

        // 2. Build the object WITH the Recruiter ID
        const newOpportunity = {
            title: getVal('eventname'),
            category: getVal('eventCategory'), 
            type: getVal('eventType'),         
            startDate: startVal,
            endDate: endVal || null,
            location: getVal('location'),
            contact: getVal('contactinfo'),
            org: getVal('sponsorname'),
            details: getVal('notes'),
            status: "Pending Vetting",
            recruiterID: currentUsername 
        };

        // 3. Save to Vetting Queue
        let vettingQueue = JSON.parse(localStorage.getItem('vettingQueue')) || [];
        vettingQueue.push(newOpportunity);
        localStorage.setItem('vettingQueue', JSON.stringify(vettingQueue));

        alert("Success! This has been sent to vetting and is linked to your account.");
        document.getElementById('eventForm').reset();

    } catch (err) {
        console.error("Submission Error:", err);
    }
    return false;
}