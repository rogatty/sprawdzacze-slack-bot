var charts = {},
	spinner;

function update() {
	spinner.removeAttr('hidden');

	$.get('/stats/' + secret)
		.done(function (data) {
			spinner.attr('hidden', true);
			updateCharts(data);
			if (data.matches) {
				$('#matches').text(data.matches);
			}
		});
}

function updateCharts(data) {
	if (!charts.length) {
		createCharts(data);
	} else {
		charts.weekdays.update(data.weekdays);
	}
}

function createCharts(data) {
	charts.weekdays = new Chartist.Bar('#weekdays', data.weekdays, {
		axisX: {
			showGrid: false
		}
	});
}

$(function () {
	spinner = $('#spinner');

	update();

	$('#refresh')
		.on('click', function () {
			update();
		});
});
