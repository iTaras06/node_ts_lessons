import express from "express"
import "dotenv/config" // из env прослушиваем порт
import bookRouter from "./routes/bookRoutes.js"
import authorRouter from "./routes/authorRoutes.js"


const cl = console.log
const PORT = process.env.PORT || 4200  // если порт есть в env то берем его оттуда, если нет то порт будет 4200
const HOST = process.env.HOST || "http://localhost" // читаем HOST из env, если его там нет, то HOST будет "http://localhost"
 
const app = express() // Создаем приложение вызывая функцию express()

//middleware - предварительный обработчик

app.use(express.json()) // Подключение готового middleware, чтобы из body читать json

//bookRouter, authorRouter подключаем после  app.use(express.json())
app.use("/books", bookRouter);
app.use("/authors", authorRouter);

app.listen(PORT, ()=>{ // Начинаем прослушивать порт
    cl(`Server has been started ${HOST}:${PORT}`)
})