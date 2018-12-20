const {
    AppServer
} = require('./lib/server');
const {
    APP_ROUTES
} = require('./routes');

const server = new AppServer(APP_ROUTES, 8080);