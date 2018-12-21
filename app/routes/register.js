const {
    PasswordsService
} = require('../lib/passwords.service');
const {
    UsersService,
    UserAlreadyExistsError
} = require('../lib/users.service');
const {
    TokenService
} = require('../lib/token.service');

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
        new TokenService().addAccessTokenToResponseCookie(res, req.body.register_username);
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