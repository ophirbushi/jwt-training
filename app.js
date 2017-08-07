const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const db = require('./db');

const secret = 'Pvvi6WSKpUT45bq8ecewKAGViV6lryW8apOgokaM1tTFA30iHejS1dV9ujoM';

app.use(bodyParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', (req, res) => {
    res.sendfile('./index.html');
});

app.get('/door', (req, res) => {
    res.sendfile('./door.html');
});

app.post('/login', (req, res) => {
    db.login(req.body.signin_username, req.body.signin_password)
        .then(() => {
            const token = jwt.sign({ userName: req.body.signin_username }, secret);
            res.cookie('access-token', token, { httpOnly: true });
            res.sendStatus(200);
        }).catch((err) => {
            res.cookie('fail-auth', '1', { httpOnly: true });
            res.setHeader('content-type', 'text/plain');
            res.sendStatus(401);
        });
});

app.get('/userdetails', (req, res) => {
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
            return { key: -1, value: -1 };
        });
        const accessToken = keyValues.find(pair => pair.key === 'access-token');

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken.value, secret);
                const userName = decoded.userName;
                db.getUserDetails(userName).then(details => {
                    res.send(details);
                }).catch(err => {
                    res.sendStatus(404);
                });

            } catch (err) {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    }


});

app.listen(8080);
