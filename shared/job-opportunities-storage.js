var WHCF_JOB_OPPORTUNITIES_KEY = 'whcfSubmittedJobOpportunities';

function whcfLocalMidnightFromYmd(yyyyMmDd) {
	if (!yyyyMmDd || typeof yyyyMmDd !== 'string') {
		return null;
	}
	var parts = yyyyMmDd.split('-');
	if (parts.length !== 3) {
		return null;
	}
	var y = parseInt(parts[0], 10);
	var m = parseInt(parts[1], 10) - 1;
	var d = parseInt(parts[2], 10);
	if (isNaN(y) || isNaN(m) || isNaN(d)) {
		return null;
	}
	var date = new Date(y, m, d);
	date.setHours(0, 0, 0, 0);
	return date;
}

function whcfTodayMidnight() {
	var t = new Date();
	t.setHours(0, 0, 0, 0);
	return t;
}

function whcfIsStartDateBeforeToday(yyyyMmDd) {
	var inputDay = whcfLocalMidnightFromYmd(yyyyMmDd);
	if (!inputDay) {
		return false;
	}
	return inputDay.getTime() < whcfTodayMidnight().getTime();
}

function whcfJobRowIsExpired(row) {
	if (!row || !row.startDate) {
		return false;
	}
	return whcfIsStartDateBeforeToday(row.startDate);
}

function whcfJobRowIsCurrent(row) {
	return !whcfJobRowIsExpired(row);
}

function whcfRowToDisplayJob(row) {
	var loc = row.location || '';
	if (row.startDate) {
		loc = loc ? loc + ' · Start: ' + row.startDate : 'Start: ' + row.startDate;
	}
	var summaryParts = [];
	if (row.sponsor) {
		summaryParts.push('Partner: ' + row.sponsor);
	}
	if (row.contact) {
		summaryParts.push('Contact: ' + row.contact);
	}
	if (row.notes) {
		summaryParts.push(row.notes);
	}
	return {
		title: row.title,
		organization: row.organization,
		location: loc,
		summary: summaryParts.join(' — ')
	};
}

function getStoredJobOpportunities() {
	try {
		var raw = localStorage.getItem(WHCF_JOB_OPPORTUNITIES_KEY);
		if (!raw) {
			return [];
		}
		var parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (e) {
		return [];
	}
}

function addStoredJobOpportunity(entry) {
	var list = getStoredJobOpportunities();
	var row = {
		title: entry.title || '',
		organization: entry.organization || '',
		location: entry.location || '',
		startDate: entry.startDate || '',
		contact: entry.contact || '',
		sponsor: entry.sponsor || '',
		notes: entry.notes || '',
		submittedAt: new Date().toISOString()
	};
	list.push(row);
	localStorage.setItem(WHCF_JOB_OPPORTUNITIES_KEY, JSON.stringify(list));
}
