const {
    TokenService
} = require('../lib/token.service');
const {
    UsersService
} = require('../lib/users.service');

module.exports = async (req, res) => {
    const tokenService = new TokenService();
    const accessToken = tokenService.getAccessTokenFromCookie(req.headers.cookie);
    if (!accessToken) return res.sendStatus(401);
    const verificationResult = tokenService.tryVerifyAccessToken(accessToken);
    if (verificationResult.error) {
        console.error(verificationResult.error);
        return verificationResult.errorMessage === 'invalid-token' ? res.sendStatus(401) : res.sendStatus(500);
    }
    const user = await new UsersService().getUser(verificationResult.userName);
    if (!user) return res.sendStatus(401);
    res.send(user);
};