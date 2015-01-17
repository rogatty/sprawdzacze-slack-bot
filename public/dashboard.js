function poll() {
	$.get('/stats/' + secret)
		.done(function (data) {
			console.log(data);
			if (data.matches) {
				$('#matches').text(data.matches);
			}
		})
		.always(function () {
			setTimeout(poll, 10000);
		});
}

$(function () {
	poll();
});
