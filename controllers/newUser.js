const path = require('path');
const dbPath = path.join(__dirname, '../bbdd/chatroom.db');
const db = require('better-sqlite3')(dbPath);

const newUser = (req, res, next) => {
    try {
        const { name, password } = req.body;

        // Get user by name.
        const existingUser = db
            .prepare(`SELECT id FROM users WHERE name=?;`)
            .all(name);

        // Check if username is taken by another user.
        if (existingUser.length > 0) {
            const error = new Error(
                'The name used belongs to an existing user!'
            );
            error.httpStatus = 409;
            throw error;
        }

        // Insert user in db.
        db.prepare(
            `INSERT INTO users(name, password)
                VALUES(?, ?);`
        ).run(name, password);

        res.send({
            status: 'ok',
            message: 'User created!',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = newUser;
