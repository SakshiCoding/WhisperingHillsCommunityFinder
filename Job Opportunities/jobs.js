/**
 * Static seed jobs (optional). Each entry may include startDate (YYYY-MM-DD).
 * Submissions are merged from localStorage; only current (today or future start date) show here.
 */
var JOB_OPPORTUNITIES = [];

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

	allJobs.forEach(function (job) {
		var li = document.createElement('li');
		var parts = [];
		parts.push('<span class="job-title">' + escapeHtml(job.title || 'Untitled role') + '</span>');
		if (job.organization) {
			parts.push('<span class="job-meta">' + escapeHtml(job.organization) + '</span>');
		}
		if (job.location) {
			parts.push('<span class="job-meta">' + escapeHtml(job.location) + '</span>');
		}
		if (job.summary) {
			parts.push('<p class="job-meta" style="margin-top:6px;">' + escapeHtml(job.summary) + '</p>');
		}
		li.innerHTML = parts.join('<br />');
		listEl.appendChild(li);
	});
}

document.addEventListener('DOMContentLoaded', renderJobOpportunities);
