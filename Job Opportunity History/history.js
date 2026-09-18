/**
 * Past job opportunities (start date before today), from static list + localStorage.
 */
var JOB_OPPORTUNITIES_HISTORY_STATIC = [];

/**
 * Always listed on Job Opportunity History (e.g. fixed sample entries).
 */
var JOB_OPPORTUNITIES_HISTORY_PINNED = [
	{
		title: 'Water Works Internship',
		organization: 'Whispering Hills Water Works',
		location: 'Municipal Water Works',
		startDate: '2026-04-09',
		contact: '',
		sponsor: '',
		notes: 'Internship with Water Works.'
	}
];

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

function getAllExpiredRawRows() {
	var rows = [];
	JOB_OPPORTUNITIES_HISTORY_STATIC.forEach(function (j) {
		rows.push(normalizeStaticJob(j));
	});
	if (typeof getStoredJobOpportunities === 'function') {
		rows = rows.concat(getStoredJobOpportunities());
	}
	return rows.filter(function (row) {
		return typeof whcfJobRowIsExpired === 'function' && whcfJobRowIsExpired(row);
	});
}

function sortHistoryRows(rows) {
	return rows.slice().sort(function (a, b) {
		return (b.startDate || '').localeCompare(a.startDate || '');
	});
}

function renderJobHistory() {
	var listEl = document.getElementById('historyList');
	var emptyEl = document.getElementById('emptyHistoryMessage');
	if (!listEl || !emptyEl) {
		return;
	}

	listEl.innerHTML = '';

	var pinnedRows = JOB_OPPORTUNITIES_HISTORY_PINNED.map(function (j) {
		return normalizeStaticJob(j);
	});
	var expiredRows = sortHistoryRows(getAllExpiredRawRows());
	var rawRows = pinnedRows.concat(expiredRows);
	var displayJobs = rawRows.map(function (row) {
		return typeof whcfRowToDisplayJob === 'function' ? whcfRowToDisplayJob(row) : row;
	});

	if (!displayJobs.length) {
		emptyEl.style.display = 'block';
		listEl.style.display = 'none';
		return;
	}

	emptyEl.style.display = 'none';
	listEl.style.display = 'block';

	displayJobs.forEach(function (job) {
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

document.addEventListener('DOMContentLoaded', renderJobHistory);
