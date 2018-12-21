const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const secret = require('../secret');

class TokenService {

    constructor() {
        this.ACCESS_TOKEN = 'access-token';
        this.USER_NAME = 'userName';
    }

    getAccessTokenFromCookie(cookieString) {
        const cookies = cookie.parse(cookieString || '');
        return cookies[this.ACCESS_TOKEN];
    }

    /**
     * @param {import('express').Response} res 
     * @param {string} userName 
     */
    addAccessTokenToResponseCookie(res, userName) {
        const token = jwt.sign({
            [this.USER_NAME]: userName
        }, secret);
        res.cookie(this.ACCESS_TOKEN, token, {
            httpOnly: true
        });
    }

    /**
     * @param {string} accessToken 
     * @returns {{error?:any, errorMessage?:'invalid-token',userName?:string}} 
     */
    tryVerifyAccessToken(accessToken) {
        const result = {
            error: null,
            errorMessage: null,
            userName: null
        };
        try {
            const decodedToken = jwt.verify(accessToken, secret);
            result.userName = decodedToken[this.USER_NAME];
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) result.errorMessage = 'invalid-token';
            result.error = error;
        }
        return result;
    }

}

module.exports = {
    TokenService
};