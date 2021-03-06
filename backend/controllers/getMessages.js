const path = require('path');
const dbPath = path.join(__dirname, '../bbdd/chatroom.db');
const db = require('better-sqlite3')(dbPath);

const getMessages = (req, res, next) => {
    try {
        const tokenInfo = req.userAuth;
        const { id: idUser } = req.userAuth;

        const messages = db
            .prepare(
                `
                SELECT M.*,
                S.name AS senderName,
                S.color AS senderColor,
                R.name AS receiverName
                FROM messages M
                INNER JOIN users 
				ON M.idSender = users.id AND users.id=?
                OR M.idReceiver = users.id AND users.id=?
                OR M.idReceiver IS NULL
                LEFT JOIN users S ON M.idSender = S.id
                LEFT JOIN users R ON M.idReceiver = R.id
				GROUP BY M.id;
                `
            )
            .all(idUser, idUser);

        res.send({
            status: 'ok',
            data: {
                user: tokenInfo,
                messages,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = getMessages;
