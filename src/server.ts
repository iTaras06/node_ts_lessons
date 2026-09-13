import express from "express"
import "dotenv/config" // из env прослушиваем порт
import { BookType } from "./types/BookType.js"
import { books } from "./data/books.js"
import { BookResponseType } from "./types/BookResponseType.js"
 
const cl = console.log
const PORT = process.env.PORT || 4200  // если порт есть в env то берем его оттуда, если нет то порт будет 4200
const HOST = process.env.HOST || "http://localhost" // читаем HOST из env, если его там нет, то HOST будет "http://localhost"
 
const app = express() // Создаем приложение вызывая функцию express()

const book:BookType = { // Создаем один объект книги для app.get('/book',(req,res)=>
    id:1,
    title:"New Book",
    price:2000,
    is_active:true
}

app.get('/', (req,res)=>{ // Заходим на серве по /
    res.writeHead(200,{
        "Content-Type":"text/html"
    })
    res.end("<h1>Hello from express</h1>")
})



//Отримати книжку за id
app.get('/books/:id', (req,res)=>{
    const id:number = +req.params.id
    const book:BookType|undefined = books.find((book)=>book.id===id);
    const exist_book:boolean = (book!==undefined)
    const response:BookResponseType = {
        data:exist_book?book as BookType:null,
        error:exist_book?null:"The book not found",
        status:exist_book?200:404
    };

    res.status(response.status).json(response)
})
 


// Отримати всі книжки
app.get('/books',(req,res)=>{
    const response:BookResponseType = {
        data:books.length>0?books:null,
        error:books.length>0?null:"Books list is empty",
        status:books.length>0?200:404
    };
    
    res.status(response.status).json(response)
})


// Удалить книгу по id
app.delete('/books/:id',(req,res)=>{
    const id: number = +req.params.id
    const book: BookType | undefined = books.find((book) => book.id === id);

    let status_code: number = 200;

    const response: BookResponseType = {
        data: null,
        error: null,
        status: 200
    };

    if (book === undefined)
    {
        status_code = 404;
        response.status = status_code;
        response.error = "The book not found";
    }
    else
    {
        const index = books.indexOf(book);
        books.splice(index, 1);
    }

    res.writeHead(status_code, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(response));
})

app.post('/books',(req,res)=>{
    const book: BookType = {
        id: 6,
        title: "New Book",
        price: 500,
        is_active:true
    };

    books.push(book);

    const response: BookResponseType = {
        data: book,
        error: null,
        status: 201
    };

    res.writeHead(201, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(response));
});
 


 app.get('/books/:title/:is_active',(req,res)=>{
    const title:string = req.params.title
    const is_active:boolean = req.params.is_active === "true"

    const books_all_title:BookType[] = books.filter((book)=>
            book.is_active === is_active &&
            book.title.toLowerCase().includes(title.toLowerCase())
    )

    const response:BookResponseType = {
        data:books_all_title.length>0?books_all_title:null,
        error:books_all_title.length>0?null:"The book not found",
        status:books_all_title.length>0?200:404
    }

    res.status(response.status).json(response)
})
 


app.listen(PORT, ()=>{ // Начинаем прослушивать порт
    cl(`Server has been started ${HOST}:${PORT}`)
})