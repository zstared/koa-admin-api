import config_default  from './default';
import config_dev from './dev';
import config_prod from './prod';
import config_test from './test';

function initConfig() {
	console.log('NODE_ENV:', process.env.NODE_ENV);
	switch (process.env.NODE_ENV) {
	case 'development':
		return Object.assign(config_default, config_dev);
	case 'test':
		return Object.assign(config_default, config_test);
	case 'production':
		return Object.assign(config_default, config_prod);
	default:
		return Object.assign({},config_default, config_dev);
	}
}

export default initConfig();