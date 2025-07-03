module.exports = {
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
  entities: ['src/entities/*.js'],
  migrations: ['src/migrations/*.js'],
  subscribers: ['src/subscribers/*.js'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers'
  }
};
