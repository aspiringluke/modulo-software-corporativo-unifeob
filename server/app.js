// third-party
import express from 'express';
import path  from 'path';
import session from 'express-session';

// router
import router from "./routers/router.js";

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, '../renderer/view'));
app.use(express.static(path.join(import.meta.dirname, '../renderer/public')));
app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: 'grupo4',
    resave: false,
    saveUninitializad: false,

}))

app.use('/', router);

app.listen(4040, () =>{
    console.log('Servidor inicializado em http://localhost:4040');
})