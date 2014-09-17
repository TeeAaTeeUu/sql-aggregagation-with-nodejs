var env = process.env.NODE_ENV || 'development';

var config = {
	development: {
		mysql: {
			connectionLimit : 10,
			host     : 'localhost',
			user     : 'root',
			password : 'bitnami',
			database : 'testdb',
			supportBigNumbers : 'true',

		}
	}
};

module.exports = config[env];