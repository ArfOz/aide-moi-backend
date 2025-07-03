const { DataSource } = require('typeorm');
const User = require('../entities/User');

const AppDataSource = new DataSource({
  type: process.env.DB_TYPE || 'sqlite',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'aide_moi_db',

  // SQLite specific
  ...(process.env.DB_TYPE === 'sqlite' && {
    database: process.env.DB_SQLITE_PATH || './database.sqlite'
  }),

  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: [User],
  migrations: ['src/migrations/*.js'],
  subscribers: ['src/subscribers/*.js']
});

module.exports = AppDataSource;
