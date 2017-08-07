const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient();

module.exports = (function () {
    function connect() {
        return client.connect('mongodb://localhost/auth_training', {});
    }

    function login(userName) {
        return connect()
            .then((db) => {
                return db.collection('users')
                    .findOne({
                        userName
                    });
            });
    }

    function register(userName, hash, salt) {
        return connect()
            .then((db) => {
                return db.collection('users')
                    .findOne({
                        userName
                    })
                    .then(doc => {
                        if (doc) {
                            return Promise.reject('user already exists');
                        }

                        return db.collection('users')
                            .insertOne({
                                userName,
                                hash,
                                salt
                            });
                    });
            })
    }

    function getUserDetails(userName) {
        return connect()
            .then(db => {
                return db.collection('users')
                    .findOne({
                        userName
                    });
            })
    }
    return {
        login,
        register,
        getUserDetails
    };
})();