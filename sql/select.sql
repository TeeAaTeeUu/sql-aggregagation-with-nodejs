-- %_1 , %_2, etc will be replaced later by sql.js

SELECT
	ad_id,
	SUM(impressions) as impressions,
	SUM(clicks) as clicks,
	SUM(spent) as spent,
	SUM(clicks) / SUM(impressions) as ctr,
	SUM(spent) / SUM(clicks) as cpc,
	SUM(impressions) / 1000 / SUM(spent) as cpm
FROM
	ad_statistics
WHERE
	date BETWEEN '%1' AND '%2'
	AND ad_id IN (%5)
GROUP BY ad_id;

SELECT
	ad_id,
	action,
	SUM(count) as count,
	SUM(value) as value,
	SUM(value) / SUM(count) as cpa
FROM
	ad_actions
WHERE
	date BETWEEN '%3' AND '%4'
	AND ad_id IN (%6)
GROUP BY action, ad_id;