require.config({
	baseUrl: 'src',
	paths: {
		rx: '../bower_components/rxjs/rx.modern',
		'rx.binding': '../bower_components/rxjs/rx.binding',
		'rx.jquery': '../bower_components/rxjs-jquery/rx.jquery',
		'rx.time': '../bower_components/rxjs/rx.time'
	},
	map: {
		'rx.jquery': {
			'jQuery': 'jquery'
		}
	}
});
