const jwt = require('jsonwebtoken');
const {
    PasswordsService
} = require('../lib/passwords.service');
const {
    UsersService,
    UserAlreadyExistsError
} = require('../lib/users.service');
const secret = require('../secret');

module.exports = async (req, res) => {
    if (!req.body || !req.body.register_username || !req.body.register_password) {
        res.sendStatus(400);
    }

    const {
        hash,
        salt
    } = new PasswordsService().hashPassword(req.body.register_password);

    try {
        await new UsersService().register(req.body.register_username, hash, salt);
        const token = jwt.sign({
            userName: req.body.register_username
        }, secret);
        res.cookie('access-token', token, {
            httpOnly: true
        });
        res.sendStatus(200);
    } catch (error) {
        console.error('error: ', error);
        if (error instanceof UserAlreadyExistsError) {
            res.sendStatus(409);
            return;
        }
        res.sendStatus(500);
    }
};