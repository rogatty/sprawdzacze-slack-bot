var charts = {},
	spinner;

function update() {
	spinner.removeAttr('hidden');

	$.get('/stats')
		.done(function (data) {
			spinner.attr('hidden', true);
			updateCharts(data);
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
			renderTo: 'weekdays',
			type: 'pie'
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
			plotBorderColor: '#000',
			renderTo: 'hours',
			type: 'column'
		},
		plotOptions: {
			column: {
				borderWidth: 0,
				showInLegend: false
			}
		},
		xAxis: {
			allowDecimals: false,
			lineColor: '#556A7A',
			tickColor: null,
			title: {
				text: 'Hour'
			}
		},
		yAxis: {
			min: 0,
			allowDecimals: false,
			gridLineColor: '#556A7A',
			gridLineDashStyle: 'LongDash',
			title: {
				text: '% of matches'
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
			backgroundColor: null
		},
		credits: {
			enabled: false
		},
		title: null,
		tooltip: {
			enabled: false
		}
	};

	return $.extend(true, {}, defaultOptions, options);
}

$(function () {
	spinner = $('#spinner');

	update();

	$('#refresh')
		.on('click', function () {
			update();
		});
});
