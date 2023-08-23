

const currentBookReducer = (state={bookID:null}, action) => {
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
    
    let newstate = {...state};
    switch(action.type){
        case "SET_CURRENTBOOK":
            // if(action.payload.book.etag) return reduceSize(action.payload.book);
            return action.payload.book;
        case "WRITE_CURRENT_REVIEW":
            newstate.review = action.payload.review;
            return newstate
        case "WRITE_CURRENT_NOTE":
            const {time, content} = action.payload;
            let index = newstate.notes.findIndex(n=>n.time==time);
            if(index==-1){ //no note
                newstate.notes.push({time,content});
                newstate.notes.sort((a,b)=>a.time - b.time)
            }else{ //note exist
                if(content=="") newstate.notes = newstate.notes.slice(0, index).concat(newstate.notes.slice(index+1, newstate.notes.length))
                else newstate.notes[index].content = content;
            }
            return newstate;
        default:
            return state;
    }
}

export default currentBookReducer;