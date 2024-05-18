const express = require('express');
const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const app = express()
const dotenv = require('dotenv').config()

const PORT = process.env.PORT || 4000;

const authRoute = require("./router/authRoute");
const ruleRoute = require("./router/ruleRoute");
const airportRoute = require("./router/airportRoute")
const flightRoute = require("./router/flightRoute")
const permissionRoute = require("./router/permissionRoute")
const groupRoute = require("./router/groupRoute")
const requestReservationRoutes = require('./router/requestReservationRoute');
const reservationRoutes = require('./router/reservationRoute');

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors');

app.use(cors());

dbConnect();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/permission", permissionRoute)
app.use("/api/group", groupRoute)
app.use("/api/user", authRoute)
app.use("/api/rule", ruleRoute)
app.use("/api/airport", airportRoute)
app.use("/api/flight", flightRoute)
app.use('/api/request-reservations', requestReservationRoutes);
app.use('/api/reservations', reservationRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})