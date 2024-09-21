const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const router = require('./routes/index');
const { auth } = require('express-openid-connect');
const redis = require('redis');
const Bull = require('bull');
const cache = require('memory-cache');

// Load environment variables
dotenv.config();

const app = express();

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded bodies
app.use((req, res, next) => {
  // Basic request logging middleware
  console.log(`Received request for ${req.url}`);
  next();
});

// Cache setup (example using memory-cache)
app.use((req, res, next) => {
  const cacheKey = `__express__${req.originalUrl}` || req.url;
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    return res.send(cachedResponse);
  }
  res.sendResponse = res.send;
  res.send = (body) => {
    cache.put(cacheKey, body, 10000); // Cache for 10 seconds
    res.sendResponse(body);
  };
  next();
});

// Auth configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
};

// Initialize authentication middleware
app.use(auth(config));

// Middleware to make the user object available for all views
app.use((req, res, next) => {
  res.locals.user = req.oidc.user;
  next();
});

// Routes
app.use('/', router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});

// Setup background job processing with Bull and Redis
const redisClient = redis.createClient();
const queue = new Bull('my-queue', {
  redis: {
    host: 'localhost', // Adjust host if Redis is not running locally
    port: 6379
  }
});

// Example job processing
queue.process(async (job) => {
  console.log('Processing job:', job.id);
  // Add your job processing logic here
});

queue.add({ foo: 'bar' }); // Add a job to the queue for demonstration

// Start the server
const port = process.env.PORT || 3000;
http.createServer(app).listen(port, () => {
  console.log(`Listening on ${config.baseURL}`);
});
