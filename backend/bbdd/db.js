const path = require('path');
const dbPath = path.join(__dirname, 'chatroom.db');
const db = require('better-sqlite3')(dbPath);

db.exec(`PRAGMA foreign_keys = OFF;`);
db.exec(`DROP TABLE IF EXISTS users;`);
db.exec(`DROP TABLE IF EXISTS expiredTokens;`);
db.exec(`DROP TABLE IF EXISTS messages;`);

db.exec(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER UNIQUE NOT NULL, 
    name VARCHAR(50) NOT NULL UNIQUE,  
    password VARCHAR(512) NOT NULL,
    color VARCHAR(15) NOT NULL,
    lastToken VARCHAR(300),  
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT)
);`);

db.exec(`CREATE TABLE IF NOT EXISTS expiredTokens(
    id INTEGER UNIQUE NOT NULL, 
    idUser INTEGER NOT NULL,
    token VARCHAR(300) NOT NULL,  
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT)
    FOREIGN KEY (idUser) REFERENCES users(id)
);`);

db.exec(`CREATE TABLE IF NOT EXISTS messages(
    id INTEGER UNIQUE NOT NULL, 
    idSender INTEGER NOT NULL,
    idReceiver INTEGER,
    text VARCHAR(300) NOT NULL,  
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT)
    FOREIGN KEY (idSender) REFERENCES users(id)
);`);

db.exec(`PRAGMA foreign_keys = ON;`);

db.exec(
    `INSERT INTO users(name, password, color) VALUES('Vacaloura', '12345', '123,43,60');`
);

db.exec(
    `INSERT INTO users(name, password, color) VALUES('Porcoteixo', '12345', '23,149,90');`
);

db.exec(
    `INSERT INTO users(name, password, color) VALUES('Furabolos', '12345', '100,80,20');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('¡Hola! ¿Qué tal?', 1, 2, '2021-05-29 18:26:42');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('Bien, ¿tú?', 2, 1, '2021-05-29 18:27:44');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('Igual. Bueno, seguimos hablando por el chat general!', 1, 2, '2021-05-29 18:28:21');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('Sin problema, por aquí mejor', 2, null, '2021-05-29 18:30:54');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('¡Holaaaaa!', 2, null, '2021-05-29 18:35:32');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('Hellooo!!', 1, null, '2021-05-29 18:37:01');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('Bonjour everybody!!', 3, null, '2021-05-29 18:40:56');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('Buenos días a tod@s!!', 2, null, '2021-05-30 09:35:32');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('¡Hola y adiós!', 3, null, '2021-05-30 09:40:56');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('..., ¿qué dices?', 2, 3, '2021-05-30 09:42:12');`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('Otro día en la casa del señor', 1, null, '2021-05-31 14:26:42');`
);

db.close();

console.log('Database created!');
