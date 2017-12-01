const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient();

module.exports = (function () {
    async function _connect() {
        return client.connect('mongodb://localhost/auth_training', {});
    }

    /**
     * login to db
     * 
     * @param {string} userName 
     * @returns {Promise<{a:string}>} user details
     */
    async function login(userName) {
        const db = await _connect();

        return db
            .collection('users')
            .findOne({
                userName
            });
    }
    /**
     * 
     * 
     * @param {MyType} userName 
     * @param {any} hash 
     * @param {any} salt 
     * @returns 
     */
    async function register(userName, hash, salt) {
        const db = await _connect();

        const doc = await db
            .collection('users')
            .findOne({
                userName
            });

        if (doc) return Promise.reject('user already exists');

        return db
            .collection('users')
            .insertOne({
                userName,
                hash,
                salt
            });
    }

    return {
        login,
        register
    };
})();