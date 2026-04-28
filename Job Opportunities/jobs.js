/**
 * Static seed jobs (optional). Each entry may include startDate (YYYY-MM-DD).
 * Submissions are merged from localStorage; only current (today or future start date) show here.
 */
var JOB_OPPORTUNITIES = [];

/**
 * BRIDGING SCRIPT
 * This connects your specific Job pages to the global database
 */

function getStoredJobOpportunities() {
    // This pulls the data we've been using in the Home Page and Admin pages
    return JSON.parse(localStorage.getItem('globalOpportunities')) || [];
}

function whcfJobRowIsCurrent(row) {
    // If the job date is today or in the future, it stays in "Job Opportunities"
    if (!row.date) return true; 
    const today = new Date().toISOString().split('T')[0];
    return row.date >= today;
}

function whcfJobRowIsExpired(row) {
    // If the job date has passed, it moves to "Job Opportunity History"
    if (!row.date) return false;
    const today = new Date().toISOString().split('T')[0];
    return row.date < today;
}

function whcfRowToDisplayJob(row) {
    // This maps the names from your database (org/details) 
    // to the names your jobs.js expects (organization/summary)
    return {
        title: row.title || 'Untitled Role',
        organization: row.org || row.organization || 'N/A',
        location: row.location || 'N/A',
        summary: row.details || row.notes || '',
        date: row.date || ''
    };
}

function escapeHtml(text) {
	if (text == null) {
		return '';
	}
	var div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

function normalizeStaticJob(j) {
	return {
		title: j.title || '',
		organization: j.organization || '',
		location: j.location || '',
		startDate: j.startDate || '',
		contact: j.contact || '',
		sponsor: j.sponsor || '',
		notes: j.notes != null ? j.notes : (j.summary || '')
	};
}

function getAllCurrentRawRows() {
	var rows = [];
	JOB_OPPORTUNITIES.forEach(function (j) {
		rows.push(normalizeStaticJob(j));
	});
	if (typeof getStoredJobOpportunities === 'function') {
		rows = rows.concat(getStoredJobOpportunities());
	}
	return rows.filter(function (row) {
		return typeof whcfJobRowIsCurrent === 'function' && whcfJobRowIsCurrent(row);
	});
}

function getAllJobsToDisplay() {
	return getAllCurrentRawRows().map(function (row) {
		return typeof whcfRowToDisplayJob === 'function' ? whcfRowToDisplayJob(row) : row;
	});
}

function renderJobOpportunities() {
	var listEl = document.getElementById('jobList');
	var emptyEl = document.getElementById('emptyJobsMessage');
	if (!listEl || !emptyEl) {
		return;
	}

	listEl.innerHTML = '';

	var allJobs = getAllJobsToDisplay();

	if (!allJobs.length) {
		emptyEl.style.display = 'block';
		listEl.style.display = 'none';
		return;
	}

	emptyEl.style.display = 'none';
	listEl.style.display = 'block';

	// Inside Job Opportunities/jobs.js -> renderJobOpportunities function

	allJobs.forEach(function (job) {
    var li = document.createElement('li');
    li.style.borderBottom = "1px solid #ddd";
    li.style.padding = "15px 0";

    // We only include the text fields. 
    // Notice there is NO mention of applyUrl here.
    var html = `
        <span class="job-title" style="color: #9B1313; font-weight: bold; font-size: 1.2em;">${escapeHtml(job.title)}</span><br />
        <span class="job-meta"><strong>Org:</strong> ${escapeHtml(job.organization)}</span><br />
        <span class="job-meta"><strong>Location:</strong> ${escapeHtml(job.location)}</span><br />
        <p style="margin-top:6px;">${escapeHtml(job.summary)}</p>
    `;
    
    li.innerHTML = html;
    listEl.appendChild(li);
	});
}


document.addEventListener('DOMContentLoaded', renderJobOpportunities);
