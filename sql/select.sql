-- %_1 , %_2, etc will be replaced later by sql.js

SELECT
	a.ad_id,
	SUM(a.impressions) as impressions,
	SUM(a.clicks) as clicks,
	SUM(a.spent) as spent,
	SUM(a.clicks) / SUM(a.impressions) as ctr,
	SUM(a.spent) / SUM(a.clicks) as cpc,
	SUM(a.impressions) / 1000 / SUM(a.spent) as cpm,
	b.action,
	SUM(b.count) as count,
	SUM(b.value) as value,
	SUM(b.value) / SUM(b.count) as cpa
FROM
	ad_statistics a,
	ad_actions b
WHERE
	a.date BETWEEN '%1' AND '%2'
	AND b.date BETWEEN '%3' AND '%4'
	AND a.ad_id IN (%5)
	AND b.ad_id IN (%6)
GROUP BY a.ad_id, b.action;