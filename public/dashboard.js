var charts = {},
	spinner;

function getUserInfo() {
	$.get('/user-info/' + secret)
		.done(function (data) {
			$('#player-image').attr('src', data.image);
			$('#player-name').text(data.name);
		});
}

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
		charts.hours.update(data.hours);
	}
}

function createCharts(data) {
	charts.weekdays = createWeekdaysChart(data.weekdays);
	charts.hours = createHoursChart(data.hours);
}

function createWeekdaysChart(data) {
	return new Highcharts.Chart(getChartConfig({
		chart: {
			renderTo: 'weekdays'
		},
		xAxis: {
			categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
		},
		series: [{
			data: data
		}]
	}));
}

function createHoursChart(data) {
	return new Highcharts.Chart(getChartConfig({
		chart: {
			renderTo: 'hours'
		},
		xAxis: {
			title: {
				text: 'Hour'
			}
		},
		series: [{
			data: data
		}]
	}));
}

function getChartConfig(options) {
	var defaultOptions = {
		chart: {
			type: 'column',
			backgroundColor: null,
			plotBorderColor: '#000'
		},
		credits: {
			enabled: false
		},
		plotOptions: {
			column: {
				borderWidth: 0,
				showInLegend: false
			}
		},
		title: null,
		tooltip: {
			enabled: false
		},
		xAxis: {
			allowDecimals: false,
			lineColor: '#556A7A',
			tickColor: null
		},
		yAxis: {
			allowDecimals: false,
			gridLineColor: '#556A7A',
			gridLineDashStyle: 'LongDash',
			min: 0,
			title: {
				text: 'Matches'
			}
		}
	};

	return $.extend(true, {}, defaultOptions, options);
}

$(function () {
	spinner = $('#spinner');

	getUserInfo();
	update();

	$('#refresh')
		.on('click', function () {
			update();
		});
});
