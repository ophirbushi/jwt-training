module.exports = (req, res) => {
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
};
