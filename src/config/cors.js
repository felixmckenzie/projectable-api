import cors from 'cors';

export default cors({
  origin: process.env.NODE_ENV === 'development' ? '0.0.0.0' : process.env.CORS_ORIGIN,
});