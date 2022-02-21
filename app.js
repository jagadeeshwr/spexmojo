const express = require('express');
const Sentry = require('@sentry/node');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const expressValidator = require('express-validator');
const cors = require('cors');
const lodash = require('lodash')




/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
if(process.env.NODE_ENV === 'test'){
    dotenv.load({path: __dirname+'/.test.env'});
}else{
    dotenv.load({path: '.env'});
}

const _ = require('lodash');

/**
 * Create Express server.
 */
let app = express();
Sentry.init({ dsn:  process.env.SENTRY_URL});

global._ = lodash;
// Router
let indexRouter = require('./routes/index');




app.use(Sentry.Handlers.requestHandler());
require('./config/customExceptionHandler');

// GZIP compress resources served
app.use(compression());

app.use(cors());


/**
 * Start Express server.
 */
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});
global.HOST_URL = process.env.HOST;

/**
 * Express configuration.
 */
if(process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');

app.use('/', express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));

app.use(function (req, res, next) {
    global.HOST_URL = process.env.HOST;

    console.log("HOST_URL: " + global.HOST_URL);

    // if (process.env.ENVIRONMENT === 'prod' && req.headers["x-forwarded-proto"] !== 'https') {
    //     res.redirect("https://" + req.headers.host + req.url);
    // } else if (req.subdomain && req.subdomain === 'api') {
    //     req.url = '/api' + req.url;
    // }

    return next();

});

app.use(function(req, res, next) {
    if(process.env.NODE_ENV === 'dev') {
        console.log("req body", req.body);
        console.log("req query", req.query);
        console.log("authorization", req.headers.authorization);
    }
    next();
});



// application specific logging, throwing an error, or other logic here
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

// Routes
app.use('/', indexRouter);
require('./routes/api/v1');

// if (process.env.ENVIRONMENT === 'prod') {
    app.use(Sentry.Handlers.errorHandler());
// }

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler());
}
console.log("User SERVER_TYPE: " + process.env.SERVER_TYPE);
module.exports = app;

