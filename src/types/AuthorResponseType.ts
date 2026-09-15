import { AuthorType } from "./AuthorType.js"
import { BookType } from "./BookType.js"

export type AuthorResponseType = {
    data: null | AuthorType | AuthorType[] | (AuthorType & { books: BookType[] }),
    error: null | string,
    status: number
}