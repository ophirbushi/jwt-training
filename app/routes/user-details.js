const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const secret = require('../secret');
const {
    UsersService
} = require('../lib/users.service');

module.exports = async (req, res) => {
    const cookies = cookie.parse(req.headers.cookie);
    const accessToken = cookies['access-token'];
    if (!accessToken) return res.sendStatus(401);
    try {
        const decoded = jwt.verify(accessToken, secret);
        const userName = decoded['userName'];
        const user = await new UsersService().getUser(userName);
        if (!user) return res.sendStatus(401);
        res.send(user);
    } catch (error) {
        console.error('error: ', error);
        res.sendStatus(500);
    }
};