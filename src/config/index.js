import config_default  from './default';
import config_dev from './dev';
import config_prod from './pro';

function initConfig() {
	console.log('NODE_ENV:', process.env.NODE_ENV);
	switch (process.env.NODE_ENV) {
	case 'development':
		return Object.assign(config_default, config_dev);
	case 'production':
		return Object.assign(config_default, config_prod);
	default:
		return Object.assign({},config_default, config_dev);
	}
}

export default initConfig();