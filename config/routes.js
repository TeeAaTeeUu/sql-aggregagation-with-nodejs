var sql = require('../controllers/sql');

module.exports = function(app) {

	app.get('/api/stats', sql.getStats);

	app.use('/api/*', function (req, res) {
		res.status(404).send('Sorry, 404 Not Found');
	});

	app.use(function(err, req, res, next){
  		console.error(err.stack);
  		res.status(500).send("something went wrong, sorry -- " + err.message);
	});
};