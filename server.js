const express = require("express");

const app = express();

// Use express.json() once to parse JSON request body
app.use(express.json());

const dbConfig = require('./db');
const hallsRoute = require('./routes/hallsRoute');
const userRoute = require('./routes/userRoute');
const bookingsRoute = require('./routes/bookingsRoute');


app.use('/api/halls', hallsRoute);
app.use('/api/users', userRoute);
app.use('/api/bookings', bookingsRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
