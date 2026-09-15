type BookType = {
    id:number,
    title:string,
    price:number,
    is_active?:boolean
    image?:string
    authors_id:number[]
}

type BookCreateType = Omit<BookType, "id">;
export{BookType, BookCreateType}