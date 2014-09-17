sql-aggregagation-with-nodejs
=============================

SQL hakuja varten luotu http-api, joka kuuntelee käytännössä vain seuraavaa formaattia:

´´´
GET /api/stats?ad_ids=1,2,3&start_time=2013-09-01&end_time=2013-10-01
´´´

Yksinkertainen SQL-query, joka yhdistää kaksi taulua ja laskee summia. Pientä kikkailua mysql-palautteen kanssa, jotta lopputulos halutun muotoinen. Kaikki raskas laskenta tapahtuu SQL-tietokannassa, nodejs-api on vain "wrapper".
