export default () => ({
  port: process.env.PORT,
  accessSecret: process.env.JWT_SECRET_KEY,
  refreshSecret: process.env.JWT_REFRESH_KEY,
  mongoDbKey: process.env.MONGODB_CONNECTION_STRING,
});
