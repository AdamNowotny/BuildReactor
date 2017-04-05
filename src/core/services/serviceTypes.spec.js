import serviceTypes from 'core/services/serviceTypes';

describe('core/services/serviceTypes', () => {

	function CustomBuildService(settings) {}
	CustomBuildService.settings = () => settings;

	const settings = {
		baseUrl: 'test',
		url: 'http://www.example.com/',
		name: 'service name',
		projects: [],
		disabled: false
	};

	afterEach(() => {
		serviceTypes.clear();
	});

	it('should return empty array if no services registered', () => {
		const types = serviceTypes.getAll();

		expect(types).toEqual({});
	});

	it('should register service', () => {
		spyOn(CustomBuildService, 'settings').and.returnValue(settings);

		serviceTypes.register(CustomBuildService);

		expect(CustomBuildService.settings).toHaveBeenCalled();
	});

	it('should return registered services', () => {
		serviceTypes.register(CustomBuildService);

		const types = serviceTypes.getAll();

		expect(types).toEqual({ test: CustomBuildService });
	});

	it('should clear registrations', () => {
		serviceTypes.register(CustomBuildService);

		serviceTypes.clear();

		expect(serviceTypes.getAll()).toEqual({});
	});
});
