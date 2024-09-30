const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const bodyparser = require('body-parser');
const multiTenantMiddleware = require('./config/multiTenantMiddleware');
// eslint-disable-next-line import/no-extraneous-dependencies
const myReqLogger = require('./Utilities/ReqLogger');
require('dotenv').config();
const route = require('./routes/routes');

const app = express();
const allowedOrigins = [
  'https://waste-disposal.vercel.app',
  'http://localhost:3000',
  'http://localhost:8000',
  null
];

app.use(cors({
    origin: '*',
    origin: function (origin, callback) {
        console.log("Request Origin:", origin); // Log the request origin
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            console.error(`CORS error for origin: ${origin}`); // Log the error
            callback(new Error('Not allowed by CORS')); // Reject the request
        }
    },
    credentials: true // Allow cookies to be sent with requests
}));



app.use(myReqLogger);
app.use(multiTenantMiddleware);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
//app.use('/', route);
app.use('/', route);
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
