require.config({
	baseUrl: 'src',
	paths: {
		rx: '../bower_components/rx/rx.modern',
		'rx.binding': '../bower_components/rx/rx.binding',
		'rx.jquery': '../bower_components/rxjs-jquery/rx.jquery',
		'rx.time': '../bower_components/rx/rx.time'
	},
	map: {
		'rx.jquery': {
			'jQuery': 'jquery'
		}
	}
});
