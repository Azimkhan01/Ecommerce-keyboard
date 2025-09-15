require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { RateLimiterRedis } = require("rate-limiter-flexible");
const app = express();
const morgan = require('morgan');
const CategoryRoutes = require('./routes/CategoryRoutes');
const ProductRoutes = require('./routes/ProductRoutes');
const { redis } = require('./utils/redisClient');

// configure limiter 
const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rate-limit",
  points: 50, // 10 requests
  duration: 60 * 5, // per 60 seconds
});

// express middleware
const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next(); // allow request
    })
    .catch((rejRes) => {
      const retrySecs = Math.ceil(rejRes.msBeforeNext / 1000); // convert ms to seconds
      res.set("Retry-After", retrySecs); // standard HTTP header for retry
      res.status(429).json({
        message: `Too many requests. Try again in ${retrySecs} seconds`
      });
    });
};



// Middlewares
app.use(cors());
app.use(morgan())
app.use(rateLimiterMiddleware);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Your routes go here
app.use("/", CategoryRoutes);
app.use("/", ProductRoutes);

// ✅ Common Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack || err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
  });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});
