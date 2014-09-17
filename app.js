var express = require('express');
var app = express();

require('./config/routes')(app);

app.listen(3000);