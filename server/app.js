// node built-in
import path  from 'path';

// third-party
import express from 'express';
import session from 'express-session';
import dotenv from "dotenv";

// internal
import router from "./routers/router.js";
import { conectar } from "./config/connection.js";

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, '../renderer/view'));
app.use(express.static(path.join(import.meta.dirname, '../renderer/public')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

app.use('/', router);

app.listen(4040, () =>{
    console.log('Servidor inicializado em http://localhost:4040');
});
