import logger from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

// rutas
import mainRouter from "./routes/main.router";
import userRouter from "./routes/user.router";
import adminRouter from "./routes/admin.router";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

// asignar rutas
app.use("/", mainRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

export default app;