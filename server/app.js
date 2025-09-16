import express from 'express';
import path  from 'path';
import session from 'express-session';
import authRouter from './routers/login.js';

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

// app.get('/', (req,res) => { return res.status(200).json({message: "Hello World!"}); })
app.use('/',authRouter)
//app.use('/dash')

app.listen(4040, () =>{
    console.log('Servidor inicializado em http://localhost:4040');
})