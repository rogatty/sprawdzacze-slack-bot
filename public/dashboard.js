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
			lineColor: '#556A7A',
			tickColor: null
		},
		yAxis: {
			min: 0,
			allowDecimals: false,
			gridLineColor: '#556A7A',
			gridLineDashStyle: 'LongDash',
			title: {
				text: 'Matches'
			}
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
