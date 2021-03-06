const path = require('path');
const dbPath = path.join(__dirname, '../bbdd/chatroom.db');
const db = require('better-sqlite3')(dbPath);

function randomDarkColor() {
    let color = '';
    for (let i = 0; i < 3; i++) {
        color += `${Math.floor(Math.random() * 151)},`;
    }
    return color.slice(0, color.length - 1);
}

const newUser = (req, res, next) => {
    try {
        const { name, password } = req.body;

        // Check if name or password have less than 4 characters.
        if (name.length < 4 || password.length < 4) {
            const error = new Error(
                'Username and password must be at least 4 characters long!'
            );
            error.httpStatus = 409;
            throw error;
        }

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
            `INSERT INTO users(name, password, color)
                VALUES(?, ?, ?);`
        ).run(name, password, randomDarkColor());

        res.send({
            status: 'ok',
            message: 'User created!',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = newUser;
