const express = require('express');
const bodyParser = require('body-parser');

class AppServer {

    /**
     * @param {Array<import("../../types").RouteDefinition>} routes 
     */
    constructor(routes) {
        const app = this.app = express();
        this._registerMiddlewares(app);
        this._registerRoutes(app, routes);
    }

    /** @param {number} port */
    listen(port = 8080) {
        this.app.listen(port, () => console.log('listening on port ' + port));
    }

    _registerMiddlewares(app) {
        app.use(bodyParser.json()); // to support JSON-encoded bodies
        app.use(bodyParser());
        app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
            extended: true
        }));
    }

    /**
     * @param {Array<import("../../types").RouteDefinition>} routes 
     */
    _registerRoutes(app, routes) {
        routes.forEach(route => {
            if (typeof app[route.method] === 'function') {
                app[route.method](route.path, route.handler);
            } else {
                console.error('error: unknown route method', route.method);
            }
        });
    }
}

module.exports = {
    AppServer
};