require.config({
	baseUrl: 'src',
	paths: {
		rx: '../bower_components/Rx/rx.modern',
		'rx.binding': '../bower_components/Rx/rx.binding',
		'rx.jquery': '../bower_components/rxjs-jquery/rx.jquery',
		'rx.time': '../bower_components/Rx/rx.time'
	},
	map: {
		'rx.jquery': {
			'jQuery': 'jquery'
		}
	}
});
