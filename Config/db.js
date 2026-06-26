const { Sequelize } = require('sequelize');

// Default MySQL config (development). Override with env vars as needed.
const db = {
    sequelize: new Sequelize(process.env.DB_NAME || 'practicedb', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '1234', {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: console.log,
    }),
};

async function initialize() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to MySQL, falling back to SQLite:', err.message || err);
        // Fallback to a local sqlite file so the server can run in dev without MySQL
        db.sequelize = new Sequelize({ dialect: 'sqlite', storage: 'database.sqlite', logging: console.log });
        try {
            await db.sequelize.authenticate();
            console.log('Using SQLite fallback (database.sqlite)');
        } catch (sqliteErr) {
            console.error('SQLite fallback also failed:', sqliteErr);
            process.exit(1);
        }
    }
}

db.initialize = initialize;

module.exports = db;
