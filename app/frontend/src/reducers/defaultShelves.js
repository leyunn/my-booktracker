

const defaultShelvesReducer = (state=[[],[],[]], action) => {
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

    let newstate = [[...state[0]],[...state[1]],[...state[2]]];
    let index = -1;
    switch(action.type){
        case "LOAD_DEFAULTSHELVES":
            let reduced_books = action.payload.books.map(n=>reduceSize(n))
            newstate[action.payload.id] = reduced_books;
            return newstate;
        case "ADD_BOOK_DEFAULT":
            index = newstate[action.payload.id].findIndex(n=>n.id==action.payload.book.id)
            if(index==-1) newstate[action.payload.id].unshift(reduceSize(action.payload.book))
            return newstate;
        case "DELETE_BOOK_DEFAULT":
            index = newstate[action.payload.pos].findIndex(n=>n.id==action.payload.id)
            if(index!=-1) newstate[action.payload.pos] = newstate[action.payload.pos].slice(0, index).concat(newstate[action.payload.pos].slice(index+1, newstate[action.payload.pos].length))
            return newstate;
        case "CLEARSHELF":
            if(action.payload.pos==1){ //to read
                newstate[1] =[]
            }if(action.payload.pos==2){ //reading now
                newstate[0] = []
            }
            return newstate;
        default:
            return state;
    }
}

export default defaultShelvesReducer;