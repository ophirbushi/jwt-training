const {
    AppServer
} = require('./lib/server');
const {
    APP_ROUTES
} = require('./routes/index');

const server = new AppServer(APP_ROUTES);
server.listen();
