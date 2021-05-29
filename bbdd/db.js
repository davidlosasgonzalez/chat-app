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
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT)
    FOREIGN KEY (idUser) REFERENCES users(id)
);`);

db.exec(`CREATE TABLE IF NOT EXISTS messages(
    id INTEGER UNIQUE NOT NULL, 
    idSender INTEGER NOT NULL,
    idReceiver INTEGER,
    text VARCHAR(300) NOT NULL,  
    createdAt TIMESTAMP NOT NULL,
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
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('¿Qué tal?', 1, 2, CURRENT_TIMESTAMP);`
);

db.exec(
    `INSERT INTO messages(text, idSender, idReceiver, createdAt) VALUES('Bien, ¿tú?', 2, 1, CURRENT_TIMESTAMP);`
);

db.close();

console.log('Database created!');
