const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient();

module.exports = (function () {
    function connect() {
        return client.connect('mongodb://localhost/auth_training', {});
    }

    function login(userName, password) {
        const onError = () => { };
        return connect()
            .then((db) => {
                return db.collection('users')
                    .find({ userName })
                    .next()
                    .then((doc) => {
                        if (doc.password == password) {
                            return 'ok';
                        } else {
                            return Promise.reject('auth failed');
                        }
                    });
            });
    }

    function getUserDetails(userName) {
        return connect()
            .then(db => {
                return db.collection('user-details')
                    .find({ userName }).next();
            })
    }
    return {
        login,
        getUserDetails
    };
})();

