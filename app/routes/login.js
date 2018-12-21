const {
    TokenService
} = require('../lib/token.service');
const {
    PasswordsService
} = require('../lib/passwords.service');
const {
    UsersService
} = require('../lib/users.service');

module.exports = async (req, res) => {
    try {
        const user = await new UsersService().getUser(req.body.signin_username);
        if (!user) return res.sendStatus(401);
        const hash = new PasswordsService().hashPassword(req.body.signin_password, user.salt).hash;
        if (hash !== user.hash) return res.sendStatus(401);
        new TokenService().addAccessTokenToResponseCookie(res, req.body.signin_username);
        res.sendStatus(200);
    } catch (error) {
        console.error('error: ', error);
        res.sendStatus(500);
    }
};