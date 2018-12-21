const crypto = require('crypto');

class PasswordsService {

    constructor() {
        /** @type import('crypto').HexBase64Latin1Encoding */
        this.encoding = 'base64';
        this.saltBytesCount = 32;
        this.hashAlgorithm = 'sha256';
    }

    /**
     * 
     * @param {string} password 
     * @param {string} salt 
     */
    hashPassword(password, salt = undefined) {
        if (salt === undefined) {
            salt = crypto.randomBytes(this.saltBytesCount).toString(this.encoding);
        }
        const hashObject = crypto.createHash(this.hashAlgorithm);
        hashObject.update(`${salt}${password}`);
        return {
            salt,
            hash: hashObject.digest(this.encoding)
        };
    }
}

module.exports = {
    PasswordsService
}