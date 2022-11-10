import cors from 'cors';

export default cors({
  origin:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.CORS_ORIGIN,
});
