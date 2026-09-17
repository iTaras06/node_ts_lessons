import { BookType } from "../types/BookType.js"
//BookType[]
const books: Array<BookType> = [
  {
    id: 1,
    title: "Кобзар",
    price: 250,
    is_active: true,
    authors_id: [1],
    image: "kobzar.jpg"
  },
  {
    id: 2,
    title: "Тигролови",
    price: 320,
    is_active: true,
    authors_id: [2],
    image: "tygrolovy.jpg"
  },
  {
    id: 3,
    title: "1984",
    price: 400,
    is_active: true,
    authors_id: [3],
    image: "1984.jpg"
  },
  {
    id: 4,
    title: "Гаррі Поттер і філософський камінь",
    price: 450,
    is_active: false,
    authors_id: [4],
    image: "harry.jpg"
  },
  {
    id: 5,
    title: "Маленький принц",
    price: 280,
    is_active: true,
    authors_id: [5],
    image: "prince.jpg"
  },
  { 
    id: 6, 
    title: "Збірка оповінань", 
    price: 500, 
    is_active: true, 
    authors_id: [3, 6],
    image: "zbirka-op.png" 
  },
  { id: 7, 
    title: "Історія української літератури", 
    price: 600, 
    is_active: true, 
    authors_id: [8, 9],
    image: "history.jpg" 
  },
  { id: 8, 
    title: "Химераріум", 
    price: 380, 
    is_active: false, 
    authors_id: [2, 7],
    image: "himera.png" 
  }
];
 
export { books };