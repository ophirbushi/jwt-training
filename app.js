const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const db = require('./db');

const secret = 'Pvvi6WSKpUT45bq8ecewKAGViV6lryW8apOgokaM1tTFA30iHejS1dV9ujoM';

app.use(bodyParser());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.get('/', (req, res) => {
    res.sendfile('./index.html');
});

app.get('/door', (req, res) => {
    res.sendfile('./door.html');
});

app.post('/login', (req, res) => {
    db.login(req.body.signin_username)
        .then((doc) => {
            const salt = doc.salt;

            const hashObject = crypto.createHash('sha256');
            hashObject.update(`${salt}${req.body.signin_password}`);
            const hash = hashObject.digest('base64');

            if (hash !== doc.hash) {
                return res.sendStatus(401);
            }

            const token = jwt.sign({
                userName: req.body.signin_username
            }, secret);
            res.cookie('access-token', token, {
                httpOnly: true
            });
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(401);
        });
});

app.post('/register', (req, res) => {
    if (!req.body || !req.body.register_username || !req.body.register_password) {
        res.sendStatus(400);
    }

    const salt = crypto.randomBytes(32).toString('base64');

    const hashObject = crypto.createHash('sha256');
    hashObject.update(`${salt}${req.body.register_password}`);

    const hash = hashObject.digest('base64');

    db.register(req.body.register_username, hash, salt)
        .then(() => {
            const token = jwt.sign({
                userName: req.body.register_username
            }, secret);
            res.cookie('access-token', token, {
                httpOnly: true
            });
            res.sendStatus(200);
        }).catch((err) => {
            res.send(err);
        });
});


app.post('/userdetails', (req, res) => {
    const cookie = req.headers.cookie;
    if (cookie) {
        const cookies = cookie.split(';');

        const keyValues = cookies.map(c => {
            c = c.trim();
            const split = c.split('=');
            if (split) {
                return {
                    key: split[0],
                    value: split[1]
                };
            }
            return {
                key: -1,
                value: -1
            };
        });
        const accessToken = keyValues.find(pair => pair.key === 'access-token');

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken.value, secret);
                const userName = decoded.userName;
                db.login(userName).then(details => {
                    res.send(details);
                }).catch(err => {
                    res.sendStatus(404);
                });

            } catch (err) {
                res.sendStatus(401);
            }
        } else {
            return res.sendStatus(401);
        }
    } else {
        return res.sendStatus(401);
    }
});


app.listen(80);