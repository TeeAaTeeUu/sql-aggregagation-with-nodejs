var config = require('../config/config');
var fs = require('fs');
var config = require('../config/config');

var mysql = require('mysql');

var pool  = mysql.createPool(config.mysql);

exports.getStats = function(req, res) {
	var params = parseQuery(req);

	prepareQuery(params, function(query) {
		pool.getConnection(function(err, connection) {
			if(err) {
				throw new Error(("sql connection error " + err))
			};
			doQuery(connection, query, req, res);
		});
	})
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

function prepareQuery(params, callback) {
	fs.readFile("./sql/select.sql", "utf8", function(err, string) {
		getValues(params).forEach( function(elem, i) {
			string = string.replace("%" + (i+1), elem)
		});
		callback(string);
	});
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
};

function doQuery(connection, query, req, res) {
	connection.query(query, function(err, rows) {
		if(err) {
			throw new Error("sql error " + err);
		}
		connection.release();
		doMagicWithRows(rows, req, res);
	});
};

function doMagicWithRows (rows, req, res) {
	var actions = loopActions(rows);

	res.send(loopStatistics(rows, actions));
};

function loopActions(rows) {
	var actions = {};

	rows[1].forEach( function(elem) {
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

	rows[0].forEach( function (elem) {
		statistics[elem.ad_id] = returnStatisticObj(elem, actions);
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