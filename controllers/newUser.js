const path = require('path');
const dbPath = path.join(__dirname, '../bbdd/chatroom.db');
const db = require('better-sqlite3')(dbPath);

const newUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Get user with body username.
        const existingUsername = db
            .prepare(`SELECT id FROM users WHERE username=?;`)
            .all(username);

        // Check if username is taken by another user.
        if (existingUsername.length > 0) {
            const error = new Error(
                'The username used belongs to an existing user!'
            );
            error.httpStatus = 409;
            throw error;
        }

        // Insert user in db.
        db.prepare(
            `INSERT INTO users(username, password)
                VALUES(?, ?);`
        ).run(username, password);

        res.send({
            status: 'ok',
            message: 'User created!',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = newUser;
