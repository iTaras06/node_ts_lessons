import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import { URL } from "node:url"
import { books } from "./data/books.js"
import 'dotenv/config'
import { showAllBooks, showBook } from "./utils/showBooks.js"
import { BookType } from "./types/BookType.js"
const PORT:number = 4200

const server = http.createServer((req,res)=>{
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`)
    const PATH_TO_PAGES = path.join("src","pages")
    if(req.method==="GET" &&  req.url==='/books')
    {
        const books_content:string = showAllBooks(books)
        res.setHeader("Content-Type", "text/html; charset=utf-8")
        res.write(books_content)
        res.end()
    }
    else if(req.method === "GET" && url.pathname==='/book/' && url.searchParams)
    {
        if(url.searchParams.get("id")!==undefined)
        {
            const id:number = Number(url.searchParams.get("id"))
            const book : BookType|undefined= books.filter(book=>book.id===id)[0]
            console.log(book)
            if(book!==undefined)
            {
                res.setHeader("Content-Type", "text/html; charset=utf-8")
                res.write(showBook(book))    
            }
        }
       
        res.end()
    }






    else if(req.method === "GET" && url.pathname === "/add-book")
    {
    const PATH_TO_ADD_BOOK_PAGE = path.join(
        PATH_TO_PAGES,
        "add-book.html"
    )

    const content = fs.readFileSync(PATH_TO_ADD_BOOK_PAGE)

    res.setHeader(
        "Content-Type",
        "text/html; charset=utf-8"
    )

    res.write(content)
    }

    else if (req.method === "POST" && url.pathname === "/books") {

    let body = "";

    req.on("data", (buf) => {
        body += buf;
    });

    req.on("end", () => {

        const newBook: BookType  = JSON.parse(body);

        newBook.id = books.length + 1;

        books.push(newBook);

        console.log("Новая книга:", newBook);
        console.log("Все книги:", books);

        res.setHeader(
            "Content-Type",
            "application/json; charset=utf-8"
        );

        res.end(JSON.stringify({
            message: "Книгу добавлено",
            book: newBook
        }));
    });
    return
}





    else if(req.method==="GET" && path.extname(req.url as string)==='.css')
    {
        const PATH_TO_CSS = path.join("src","styles",req.url as string)
        const content = fs.readFileSync(PATH_TO_CSS)
        res.setHeader("Content-Type", "text/css; charset=utf-8")

        res.write(content)
    }

    else if (req.method==="GET" && [".jpg",".JPG",".jpeg",".JPEG",".png",".PNG", ".webp",".WEBP"].includes( 
        path.extname(req.url as string))) { 
        const PATH_TO_IMAGE = path.join("src","images", 
            path.basename(req.url as string)) 
        const content = fs.readFileSync(PATH_TO_IMAGE) 
        res.setHeader("Content-Type", "image/jpeg") 
        res.write(content) 
    }


    else if(req.method==="GET" && req.url==='/')
    {
        const PATH_TO_INDEX_PAGE = path.join(PATH_TO_PAGES, "index.html")
        const content = fs.readFileSync(PATH_TO_INDEX_PAGE)
        res.setHeader("Content-Type", "text/html; charset=utf-8")

        res.write(content)
    }

    else if(req.method==="GET" && req.url==='/about')
    {
        const PATH_TO_ABOUT_PAGE = path.join(PATH_TO_PAGES,"about.html")
        const content = fs.readFileSync(PATH_TO_ABOUT_PAGE)
        res.setHeader("Content-Type", "text/html; charset=utf-8")

        res.write(content)
    }

    // else if(req.method === "POST"){
    //     res.setHeader("Content-Type", "application/json; charset=utf-8")
    //     const user = {
    //         name:"Alex", 
    //         age:20
    //     }
    //     res.write(JSON.stringify(user))
    // }

     else if(req.method === "PUT"){
        res.write(`Ти хочеш оновити дані. Request: ${req.method}`)
    }
   
    res.end()
})

// server.listen(PORT,()=>{
//     console.log(`Server http://localhost:${PORT} has been started...`)
// })

server.listen(process.env.PORT,()=>{
    console.log(`Chinazes ${process.env.HOST}:${process.env.PORT} has been started...`)
})