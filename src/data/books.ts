import { BookType } from "../types/BookType.js"
//BookType[]
const books: Array<BookType> = [
  {
    id: 1,
    title: "Кобзар",
    price: 250,
    is_active: true,
    authors_id: [1]
  },
  {
    id: 2,
    title: "Тигролови",
    price: 320,
    is_active: true,
    authors_id: [2]
  },
  {
    id: 3,
    title: "1984",
    price: 400,
    is_active: true,
    authors_id: [3]
  },
  {
    id: 4,
    title: "Гаррі Поттер і філософський камінь",
    price: 450,
    is_active: false,
    authors_id: [4]
  },
  {
    id: 5,
    title: "Маленький принц",
    price: 280,
    is_active: true,
    authors_id: [5]
  },
  { 
    id: 6, 
    title: "Test", 
    price: 350, 
    is_active: false, 
    authors_id: [] 
  },
  { id: 7, 
    title: "test", 
    price: 150, 
    is_active: false, 
    authors_id: [] 
  },
  { 
    id: 8, 
    title: "Спільна праця", 
    price: 500, 
    is_active: true, 
    authors_id: [6, 7] 
  },
  { id: 9, 
    title: "Історія літератури", 
    price: 600, 
    is_active: true, 
    authors_id: [1, 3, 6] 
  },
  { id: 10, 
    title: "Збірка есе", 
    price: 380, 
    is_active: true, 
    authors_id: [2, 7] 
  }
];
 
export { books };