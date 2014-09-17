var config = require('../config/config');
var fs = require('fs');
var config = require('../config/config');

var mysql = require('mysql');

var pool  = mysql.createPool(config.mysql);

exports.getStats = function(req, res) {
	var params = parseQuery(req);

	pool.getConnection(function(err, connection) {
		connection.query(prepareQuery(params), function(err, rows) {
			if(err) {
				throw new Error("sql error");
			}
			connection.release();
			doMagicWithRows(rows, req, res);
		});
	});
};

function parseQuery(req) {
	return {
		ad_ids: checkNumber(req),
		start_time: checkStartDate(req),
		end_time: checkEndDate(req)
	};
};

function checkNumber(req) {
	return req.query.ad_ids.split(",")
	.map(function(value) {
		if(!isNaN(Number(value))) {
			return Number(value);
		} else {
			throw new Error("not a number");
		}
	})
};

function checkStartDate(req) {
	if(!isNaN(Date.parse(req.query.start_time.replace("-", "/")))) {
		return req.query.start_time;
	} else {
		throw new Error("not a date");
	}
};

function checkEndDate(req) {
	if(!isNaN(Date.parse(req.query.end_time.replace("-", "/")))) {
		return req.query.end_time;
	} else {
		throw new Error("not a date");
	}
};

function prepareQuery(params) {
	var string = readFile("sql/select.sql")

	getValues(params).forEach( function(elem, i) {
		string = string.replace("%" + (i+1), elem);
	});

	return string;	
};

function getValues(params) {
	return [
	params.start_time,
	params.end_time,
	params.start_time,
	params.end_time,
	params.ad_ids,
	params.ad_ids
	];
}

function readFile (file) {
	return fs.readFileSync("./" + file, "utf8");
};

function doMagicWithRows (rows, req, res) {
	var actions = loopActions(rows);

	res.send(loopStatistics(rows, actions));
};

function loopActions(rows) {
	var actions = {};

	rows.forEach( function(elem) {
		actions[elem.ad_id] = actions[elem.ad_id] || {};

		actions[elem.ad_id][elem.action] = {
			count: elem.count,
			value: elem.value,
			cpa: elem.cpa
		};
	});
	return actions;
};

function loopStatistics(rows, actions) {
	var statistics = {};
	var ad_ids = [];

	rows.forEach( function (elem) {
		if(ad_ids.indexOf(elem.ad_id) == -1) {
			ad_ids.push = elem.ad_id;

			statistics[elem.ad_id] = returnStatisticObj(elem, actions);
		};
	});
	return statistics;
};

function returnStatisticObj(elem, actions) {
	return {
		impressions: elem.impressions,
		clicks: elem.clicks,
		spent: elem.spent,
		ctr: elem.ctr,
		cpc: elem.cpc,
		cpm: elem.cpm,
		actions: actions[elem.ad_id]
	};
};