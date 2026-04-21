(function () {
	function applyHomeSidebarRole() {
		var main = document.getElementById('main');
		if (!main || !main.classList.contains('whcf-home-layout')) {
			return;
		}
		var nav = document.getElementById('navColumn');
		if (!nav || nav.getAttribute('data-role-sidebar') !== 'user1') {
			return;
		}
		var user = localStorage.getItem('whcfUser');
		if (user === 'user1') {
			document.body.classList.add('whcf-user1-sidebar');
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', applyHomeSidebarRole);
	} else {
		applyHomeSidebarRole();
	}
})();
