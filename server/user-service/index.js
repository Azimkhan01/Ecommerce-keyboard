require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Router = require('./routes/UserRoutes');

const app = express();
const morgan = require('morgan')
async function mongoINIT() {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log('MongoDB connected successfully.');
    })
    .catch((err) => {
      console.log('Error while connecting to database <====>', err);
    });
}

mongoINIT();

// Middlewares
app.use(cors(
  {
    // origin:"http://localhost:3000",
    origin:"http://host.docker.internal:3000",
    methods:["GET","POST","DELETE","PUT"],
    credentials:true
  }
));
app.use(morgan())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Your routes go here
app.use("/", Router);

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
