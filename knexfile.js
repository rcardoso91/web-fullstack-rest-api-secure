module.exports = {
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  development: {
    client: 'pg',
    connection: {
      host: 'dpg-clnsmdeqc21c73dvotl0-a.oregon-postgres.render.com',
      user: 'nodeapp_postgresql_instance_user',
      password: 'QUWDeIoAcoRhnwmTFnkbb3ssBRbB7hdF',
      database: 'nodeapp_postgresql_instance',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
