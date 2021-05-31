const { log } = require('console');
const path = require('path');
const dbPath = path.join(__dirname, '../bbdd/chatroom.db');
const db = require('better-sqlite3')(dbPath);

const newMessage = (req, res, next) => {
    try {
        const { id: idSender } = req.userAuth;
        const { text, receiver, createdAt } = req.body;

        // Check if text exists.
        if (!text.length) {
            const error = new Error('A message is required!');
            error.httpStatus = 409;
            throw error;
        }

        // Check text length.
        if (text.length >= 300) {
            const error = new Error(
                'Message length cant be over 300 characters!'
            );
            error.httpStatus = 409;
            throw error;
        }

        // Get sender.
        const existingSender = db
            .prepare(`SELECT id FROM users WHERE id=?;`)
            .all(idSender);

        // Check if sender exists.
        if (existingSender.length < 1) {
            const error = new Error('User not found!');
            error.httpStatus = 409;
            throw error;
        }

        // Get receiver.
        const existingReceiver = db
            .prepare(`SELECT id FROM users WHERE name=?;`)
            .all(receiver);

        let idReceiver =
            (existingReceiver[0] && existingReceiver[0].id) || null;

        // Insert user in db.
        db.prepare(
            `INSERT INTO messages(text, idSender, idReceiver, createdAt)
                VALUES(?, ?, ?, ?);`
        ).run(text, idSender, idReceiver, createdAt);

        res.send({
            status: 'ok',
            message: 'Message created!',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = newMessage;
