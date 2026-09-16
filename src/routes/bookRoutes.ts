import { Router, Request, Response } from "express";
import { books } from "../data/books.js";
import { BookCreateType, BookType } from "../types/BookType.js";
import { compareBook, getBooksByTitle } from "../utils/showBooks.js";
import { BookResponseType } from "../types/BookResponseType.js";
import { pool } from "../db/database.js";

const bookRouter = Router();

//отримання всіх книжок, або пошук по 
// ?title=book_name
//http://localhost:4200/books 

// bookRouter.get("/", 
  // (req:Request<{},BookResponseType,null,{title:string}>,res:Response,)=>{    
    // const exist_book:boolean = books.length>0
    // const title = req.query.title as string | undefined
    // let our_books:BookType[]|null = null;

    // if(title!==undefined)
    // {
    //     our_books = getBooksByTitle(title, books)
    // } else {
    //     our_books = books
    // }

    // const exist_title:boolean = our_books !== null && our_books.length > 0
    
    // const response:BookResponseType = {
    //     data:exist_book?(exist_title?our_books:null):null,
    //     error:exist_book?(exist_title?null:"The book not found"):"Books list is empty",
    //     status:exist_book?(exist_title?200:204):204
    // };
    // res.writeHead(response.status,{
    //     "Content-Type":"application/json"
    // })
    // res.end(JSON.stringify(response))
// });
 


//отримання книжки за id
// bookRouter.get("/:id", 
//     (req:Request<{id:number}>,res:Response)=>{
    
//     const id:number = +req.params.id
//     const book:BookType|undefined = books.find((book)=>book.id===id);
//     const exist_book:boolean = (book!==undefined)
//     const response:BookResponseType = {
//         data:exist_book?book as BookType:null,
//         error:exist_book?null:"The book not found",
//         status:exist_book?200:204
//     };

//     res.status(response.status).json(response)
// });
 



//створення книжки
bookRouter.post("/", 
    (req:Request<{},BookResponseType,BookCreateType>,res:Response)=>{
    const body = req.body;
    let response:BookResponseType = {
        data:null,
        error:null,
        status:500
    }
    if (body === undefined || body.title === undefined || body.price === undefined || body.is_active === undefined) {
        response = {
            data: null,
            error: "Missing title, price or is_active",
            status: 400
        };
    }
    else
    {
        const id:number = books.length>0?books.sort(compareBook)[0].id+1:1
        const book:BookType = {
            id,
            title:body.title,
            price:body.price,
            is_active:body.is_active,
            authors_id: body.authors_id ?? []
        }
        books.push(book)
        response = {
        data:book,
        error:null,
        status:201
    };
    }
   
    res.status(response.status).json(response)

});



bookRouter.post("/",(req:Request<{},BookResponseType, BookCreateType>,res:Response) => {
  const body = req.body;
  const response: BookResponseType = {
    data: null,
    error: null,
    status: 500,
  };
  if (body !== undefined) {
    const id: number = books.length > 0 ? books.sort(compareBook)[0].id + 1 : 1;
    const book: BookType = {
      id,
      title: body.title,
      price: body.price,
      is_active: body.is_active,
      authors_id: body.authors_id
    };
    books.push(book);
    response.data = book;
    response.status = 201;
  }
 
  res.status(response.status).json(response);
});


bookRouter.get("/:title/:is_active",
  (req:Request<{title:string;is_active:string}>,res:Response)=>{
    const title:string = req.params.title
    const is_active:boolean = req.params.is_active === "true"

    const books_all_title:BookType[] = books.filter((book)=>
            book.is_active === is_active &&
            book.title.toLowerCase().includes(title.toLowerCase())
    )

    const response:BookResponseType = {
        data:books_all_title.length>0?books_all_title:null,
        error:books_all_title.length>0?null:"The book not found",
        status:books_all_title.length>0?200:204
    }

    res.status(response.status).json(response)
})




//видалення книжки за id
bookRouter.delete("/:id",
  (req:Request<{id:number}>,res:Response)=>{
    const id: number = +req.params.id;
    const book: BookType | undefined = books.find((book) => book.id === id);

    const response: BookResponseType = {
        data: null,
        error: null,
        status: 200,
    };

    if (book === undefined) {
        response.status = 204;
        response.error = "The book not found";
    } else {
        const index = books.indexOf(book);
        books.splice(index, 1);
    }
    res.status(response.status).json(response);
});


//повне оновлення книжки за id
bookRouter.put("/:id",
  (req:Request<{id:number},BookResponseType,BookCreateType>,res:Response)=>{
    const id: number = +req.params.id;
    const body = req.body;
    const response: BookResponseType = {
        data: null,
        error: null,
        status: 500,
    };

  const bookIndex: number = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      response.status = 404;
      response.error = "The book not found";
    } else if (
      body === undefined ||
      body.title === undefined ||
      body.price === undefined ||
      body.is_active === undefined
    ) {
      response.status = 400;
      response.error = "Missing title, price or is_active";
    } else {
      
      books.splice(bookIndex, 1); // видаляємо стару книгу

      // створюємо нову книгу з новим id
      const newId: number = books.length > 0 ? books.sort(compareBook)[0].id + 1 : 1;
      const newBook: BookType = {
        id: newId,
        title: body.title,
        price: body.price,
        is_active: body.is_active,
        authors_id: body.authors_id ?? [],
      };
      books.push(newBook);

      response.data = newBook;
      response.error = null;
      response.status = 200;
    }

    res.status(response.status).json(response);

  });



// DATABASE

// роут, який повертає всі книги з БД та книжки за полем title з БД
bookRouter.get("/",
  async(req:Request<{},BookResponseType,null,{title:string}>, res:Response)=>{
    try {
      const title = req.query.title as string | undefined;
      const result = title !== undefined
        ? await pool.query(
            "SELECT * FROM books WHERE LOWER(title) LIKE LOWER($1)",
            [`%${title}%`]
          )
        : await pool.query("SELECT * FROM books");

      const our_books = result.rows;
      const exist_books: boolean = our_books.length > 0;

      const response: BookResponseType = {
        data: exist_books ? our_books : null,
        error: exist_books ? null : "Books list is empty",
        status: exist_books ? 200 : 404,
      };

      res.status(response.status).json(response);
    } catch (err) {
      console.error(err);
      const response: BookResponseType = {
        data: null,
        error: "Database error",
        status: 500,
      };
      res.status(response.status).json(response);
    }
  });


// роут, який повертає книгу за id з БД
bookRouter.get("/:id",
  async(req:Request<{id:number}>,res:Response)=>{
    try {
      const id: number = +req.params.id;
      const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
      const book = result.rows[0];

      const exist_book: boolean = book !== undefined;

      const response: BookResponseType = {
        data: exist_book ? book : null,
        error: exist_book ? null : "The book not found",
        status: exist_book ? 200 : 404,
      };

      res.status(response.status).json(response);
    } catch (err) {
      console.error(err);
      const response: BookResponseType = {
        data: null,
        error: "Database error",
        status: 500,
      };
      res.status(response.status).json(response);
    }
  });



export default bookRouter
