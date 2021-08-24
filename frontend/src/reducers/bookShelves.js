

const bookShelvesReducer = (state=[], action) => {
    const reduceSize = (book) =>{
        return (book.volumeInfo)? {id: book.id, volumeInfo: {
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            publishedDate : book.volumeInfo.publishedDate,
            description: book.volumeInfo.description,
            pageCount: book.volumeInfo.pageCount,
            previewLink: book.volumeInfo.previewLink,
            imageLinks: book.volumeInfo.imageLinks,
        }  }:{id: book.id, volumeInfo:{}}
    }

    let newstate = [...state];
    let index = -1;
    switch(action.type){
        case "LOAD_BOOKSHELVES":
            newstate = action.payload.bookshelves.filter(n=> !((n.id>4 && n.id<10) || n.id==1)  ).sort((a, b)=>a.id-b.id)
            return newstate;
        case "LOAD_BOOKS":
            let reduced_books = action.payload.books.map(n=>reduceSize(n))
            newstate[action.payload.pos].books = {load:true, data: reduced_books}
            return newstate;
        case "ADD_BOOK":
            if(newstate[action.payload.pos].books && newstate[action.payload.pos].books.data){
                index = state[action.payload.pos].books.data.findIndex(n=>n.id==action.payload.book.id)
                if(index!=-1) return state;
                newstate[action.payload.pos].books.data.unshift(reduceSize(action.payload.book))
            }
            newstate[action.payload.pos].volumeCount = state[action.payload.pos].volumeCount+1;
            return newstate;
        case "DELETE_BOOK":
            if(newstate[action.payload.pos].books && newstate[action.payload.pos].books.data) {
                index = newstate[action.payload.pos].books.data.findIndex(n=>n.id==action.payload.id)
                if(index==-1) return state;
                newstate[action.payload.pos].books.data = newstate[action.payload.pos].books.data.slice(0, index).concat(newstate[action.payload.pos].books.data.slice(index+1, newstate[action.payload.pos].books.data.length))
            }
            newstate[action.payload.pos].volumeCount = state[action.payload.pos].volumeCount-1;
            return newstate;
        case "CLEARSHELF":
            newstate[action.payload.pos].books = {load: true, data:[]}
            newstate[action.payload.pos].volumeCount = 0;
            return newstate;
        default:
            return state;
    }
}

export default bookShelvesReducer;