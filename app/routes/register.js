module.exports = (req, res) => {
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
};
