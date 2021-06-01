const path = require('path');
const dbPath = path.join(__dirname, '../bbdd/chatroom.db');
const db = require('better-sqlite3')(dbPath);
const jwt = require('jsonwebtoken');

const loginUser = (req, res, next) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            const error = new Error('Missing inputs!');
            error.httpStatus = 409;
            throw error;
        }

        const user = db
            .prepare('SELECT * FROM users WHERE name=? AND password=?;')
            .all(name, password);

        if (user.length < 1) {
            const error = new Error('Incorrect name or password!');
            error.httpStatus = 401;
            throw error;
        }

        const tokenInfo = {
            id: user[0].id,
            name: user[0].name,
            color: user[0].color,
        };

        let token;

        try {
            token = jwt.sign(tokenInfo, process.env.SECRET, {
                expiresIn: '30d',
            });
        } catch (err) {
            const error = new Error('Incorrect username or password!');
            error.httpStatus = 401;
            throw error;
        }

        if (user[0].lastToken) {
            db.prepare(
                `INSERT INTO expiredTokens(token, idUser) VALUES(?, ?);`
            ).run(user[0].lastToken, user[0].id);
        }

        db.prepare('UPDATE users SET lastToken=? WHERE id=?;').run(
            token,
            user[0].id
        );

        res.send({
            status: 'ok',
            data: {
                user: user[0],
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = loginUser;
