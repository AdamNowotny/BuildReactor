let types = {};

const getAll = function() {
	return types;
};

const register = function(Service) {
	const settings = Service.settings();
	types[settings.baseUrl] = Service;
};

const clear = () => {
	types = {};
};

export default {
	getAll,
	register,
	clear
};
