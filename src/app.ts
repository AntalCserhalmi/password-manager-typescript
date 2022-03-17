import 'dotenv/config'
import express from "express";
import bp from "body-parser";
import passport from "passport";
import { Strategy } from "./strategies/local";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { router as AuthRouter } from "./routes/auth";
import { router as DashRouter } from "./routes/dash";
import { Logger } from "./utils/log";

const app = express();
const MONGO_URL = process.env.MONGOHOST || "mongodb://localhost/password-manager";
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOSTNAME || "127.0.0.1";
const log = new Logger();

mongoose.connect("mongodb://localhost/password-manager");

app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        ttl: 2 * 24 * 60 * 60,
        autoRemove: "native"
    })
}));



app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("**/css", express.static(path.join(process.cwd(), "/src/public/css")));
app.use("**/assets", express.static(path.join(process.cwd(), "/src/public/assets")));
app.use("**/js", express.static(path.join(process.cwd(), "src/public/js")));

app.set("view-engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());

passport.use(Strategy);

app.use("/auth", AuthRouter);
app.use("/dash", DashRouter);


app.use(function (req: express.Request, res: express.Response) {
    res.render(path.join(process.cwd(), "src/views/error.ejs"), { data: { error: { code: 404, message: "A keresett oldal nem található!" } } });
});

app.listen(PORT, function () {
    log.info(`Server is running at ${HOST}:${PORT}`);
});