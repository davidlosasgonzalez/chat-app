const { log } = require('console');
const path = require('path');
const dbPath = path.join(__dirname, 'chatroom.db');
const db = require('better-sqlite3')(dbPath);

db.exec(`PRAGMA foreign_keys = OFF;`);
db.exec(`DROP TABLE IF EXISTS users;`);
db.exec(`DROP TABLE IF EXISTS expiredTokens;`);

db.exec(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER UNIQUE NOT NULL, 
    username VARCHAR(50) NOT NULL UNIQUE,  
    password VARCHAR(512) NOT NULL,
    lastToken VARCHAR(300),  
    PRIMARY KEY("id" AUTOINCREMENT)
);`);

db.exec(`CREATE TABLE IF NOT EXISTS expiredTokens(
    id INTEGER UNIQUE NOT NULL, 
    idUser INTEGER NOT NULL,
    token VARCHAR(300) NOT NULL,  
    PRIMARY KEY("id" AUTOINCREMENT)
    FOREIGN KEY (idUser) REFERENCES users(id)
);`);

db.exec(`PRAGMA foreign_keys = ON;`);

db.exec(`INSERT INTO users(username, password) VALUES('Vacaloura', '12345');`);

db.exec(`INSERT INTO users(username, password) VALUES('Porcoteixo', '12345');`);

db.close();

console.log('Database created!');
