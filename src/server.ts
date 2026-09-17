import express, {Request} from "express"
import "dotenv/config" // из env прослушиваем порт
import bookRouter from "./routes/bookRoutes.js"
import authorRouter from "./routes/authorRoutes.js"
import path from "node:path"
import ejs from "ejs"
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cl = console.log
const PORT = process.env.PORT || 3200  // если порт есть в env то берем его оттуда, если нет то порт будет 3200
const HOST = process.env.HOST || "http://localhost" // читаем HOST из env, если его там нет, то HOST будет "http://localhost"
 
const app = express() // Создаем приложение вызывая функцию express()


// шаблонизатор ejs
app.set("views", path.join(__dirname, "..", path.sep, "views")); 
app.set("view engine", "ejs");


//middleware - предварительный обработчик
app.use(express.static("public")) // 
app.use(express.json()) // Подключение готового middleware, чтобы из body читать json



app.get('/', (req:Request<null,null,null,{title:string}>,res)=>{
    
    res.render("pages/home",{ //берем значение title из ?title=Alex
        name:req.query.title  //записываем в name и отправляем 
                              //в pages/home
    })
})


//bookRouter, authorRouter подключаем после  app.use(express.json())
app.use("/books", bookRouter);




app.use("/authors", authorRouter);


app.listen(PORT, ()=>{ // Начинаем прослушивать порт
    cl(`Server has been started ${HOST}:${PORT}`)
})