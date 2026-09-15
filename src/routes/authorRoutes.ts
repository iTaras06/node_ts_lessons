import { Router, Request, Response } from "express";
import { authors } from "../data/authors.js"
import { AuthorResponseType } from "../types/AuthorResponseType.js";
import { books } from "../data/books.js"

const authorRouter = Router();


//отримання всіх авторів
authorRouter.get("/", 
    (req:Request,res:Response) => {
    const response: AuthorResponseType = {
        data: authors.length > 0 ? authors : null,
        error: authors.length > 0 ? null : "Authors list is empty",
        status: authors.length > 0 ? 200 : 404
    };

    res.status(response.status).json(response)
})


//отримання автора за id разом з його книгами
authorRouter.get("/:id", 
    (req:Request<{id:number}>,res:Response) => {
    const id: number = +req.params.id
    const author = authors.find((author) => author.id_author === id)

    let response: AuthorResponseType = {
        data: null,
        error: null,
        status: 500
    }

    if (author === undefined) {
        response = {
            data: null,
            error: "Author not found",
            status: 404
        };
    }
    else
    {
        const author_books = books.filter((book) => book.authors_id.includes(id))
        response = {
            data: { ...author, books: author_books },
            error: null,
            status: 200
        };
    }

    res.status(response.status).json(response)
})

export default authorRouter

