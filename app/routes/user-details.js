const jwt = require('jsonwebtoken');
const secret = require('../secret');
const {
    UsersService
} = require('../lib/users.service');

module.exports = (req, res) => {
    const cookie = req.headers.cookie;
    if (cookie) {
        const cookies = cookie.split(';');

        const keyValues = cookies.map(c => {
            c = c.trim();
            const split = c.split('=');
            if (split) {
                return {
                    key: split[0],
                    value: split[1]
                };
            }
            return {
                key: -1,
                value: -1
            };
        });
        const accessToken = keyValues.find(pair => pair.key === 'access-token');

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken.value, secret);
                const userName = decoded['userName'];
                new UsersService().getUser(userName)
                    .then(details => {
                        if (details) res.send(details);
                        else res.sendStatus(401);
                    });
            } catch (err) {
                res.sendStatus(500);
            }
        } else {
            return res.sendStatus(401);
        }
    } else {
        return res.sendStatus(401);
    }
};