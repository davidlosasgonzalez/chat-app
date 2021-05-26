const path = require('path');
const dbPath = path.join(__dirname, '../bbdd/chatroom.db');
const db = require('better-sqlite3')(dbPath);
const jwt = require('jsonwebtoken');

const isUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            const error = new Error(`Missing authentication header!`);
            error.httpStatus = 401;
            throw error;
        }

        let tokenInfo;

        try {
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (err) {
            const error = new Error(`Token not valid!`);
            error.httpStatus = 401;
            throw error;
        }

        const expiredTokens = db
            .prepare('SELECT token FROM expiredTokens WHERE idUser=?;')
            .all(tokenInfo.id);

        for (const { token } of expiredTokens) {
            if (token === authorization) {
                const error = new Error(`Token not valid!`);
                error.httpStatus = 401;
                throw error;
            }
        }

        res.send({
            status: 'ok',
            user: {
                id: tokenInfo.id,
                username: tokenInfo.username,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = isUser;
