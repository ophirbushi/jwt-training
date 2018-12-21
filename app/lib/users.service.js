const PouchDB = require('pouchdb')
const fs = require('fs');
const path = require('path');

class UserAlreadyExistsError extends Error {

    constructor() {
        super('user already exists');
    }

}

class UsersService {

    constructor() {
        const dbPath = path.resolve('./_db');

        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath);
        }

        this.db = new PouchDB('./_db/users', {
            adapter: 'leveldb'
        });
    }

    /**
     * @param {string} userName 
     */
    async getUser(userName) {
        const all = await this.db.allDocs({
            include_docs: true
        });
        return all.rows
            .map(row => row.doc)
            .find(doc => doc.userName === userName);
    }

    /**
     * @param {string} userName 
     * @param {string} hash 
     * @param {string} salt 
     */
    async register(userName, hash, salt) {
        const user = await this.getUser(userName);
        if (user) throw new UserAlreadyExistsError();
        return this.db.post({
            userName,
            hash,
            salt
        });
    }
}

module.exports = {
    UsersService,
    UserAlreadyExistsError
};