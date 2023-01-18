require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;
//connect mongodb
connectDB();

//Middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "/public")));

// Routers
app.use("/", require("./routes/root"));
app.use("/movie", require("./routes/movieRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/province", require("./routes/provinceRoutes"));
app.use("/cinema", require("./routes/cinemaRoutes"));
app.use("/room", require("./routes/roomRoutes"));
app.use("/genre", require("./routes/initConfigRoutes"));
app.use("/food", require("./routes/foodRoutes"));
app.use("/showtime", require("./routes/showtimeRoutes"));
app.use("/ticket", require("./routes/ticketRoutes"));
app.use("/user", require("./routes/userRotes"));
app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
