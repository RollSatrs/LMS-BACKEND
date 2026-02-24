// Только для запуска миграций в Docker (читает DATABASE_URL из env)
require('dotenv').config();
module.exports = {
  dialect: 'postgresql',
  schema: './dist/src/db/schema.js',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
