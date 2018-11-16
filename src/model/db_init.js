import Sequelize from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.mysql_db, config.mysql_userid, config.mysql_password, {
	host: config.mysql_host,
	port: config.mysql_port,
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	timezone: '+08:00'
});

export default sequelize;