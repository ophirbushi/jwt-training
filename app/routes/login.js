const jwt = require('jsonwebtoken');
const {
    PasswordsService
} = require('../lib/passwords.service');
const {
    UsersService
} = require('../lib/users.service');
const secret = require('../secret');

module.exports = async (req, res) => {
    try {
        const user = await new UsersService().getUser(req.body.signin_username);

        if (!user) return res.sendStatus(401);

        const {
            hash
        } = new PasswordsService().hashPassword(req.body.signin_password, user.salt);

        if (hash !== user.hash) return res.sendStatus(401);

        const token = jwt.sign({
            userName: req.body.signin_username
        }, secret);
        res.cookie('access-token', token, {
            httpOnly: true
        });
        res.sendStatus(200);
    } catch (error) {
        console.error('error: ', error);
        res.sendStatus(500);
    }
};