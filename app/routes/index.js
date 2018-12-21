const homeHandler = require('./home');
const doorHandler = require('./door');
const loginHandler = require('./login');
const registerHandler = require('./register');
const userDetailsHandler = require('./user-details');

/**
 * @type import("../../types").RouteDefinition[]
 */
const APP_ROUTES = [{
        method: 'get',
        path: '/',
        handler: homeHandler
    }, {
        method: 'get',
        path: '/door',
        handler: doorHandler
    }, {
        method: 'post',
        path: '/login',
        handler: loginHandler
    },
    {
        method: 'post',
        path: '/register',
        handler: registerHandler
    },
    {
        method: 'get',
        path: '/userdetails',
        handler: userDetailsHandler
    }
];

module.exports = {
    APP_ROUTES
};