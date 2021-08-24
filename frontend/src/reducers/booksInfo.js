const booksInfoReducer = (state=[], action) => {
    let newstate = state.map(a=>({...a}));
    let id = -1;
    const comp = (a,b)=>{
        let year_a = parseInt(a.time.slice(0,4))
        let year_b = parseInt(b.time.slice(0,4))
        if(year_a !== year_b){
            return year_a-year_b
        }else {
            let month_a = parseInt(a.time.slice(5,7))
            let month_b = parseInt(b.time.slice(5,7))
            if(month_a!== month_b){
                return month_a-month_b
            }else{
                return parseInt(a.time.slice(8,10))-parseInt(b.time.slice(8,10))
            }
        }
    }

    switch(action.type){
        case "SAVE_IMAGE":
            id = state.findIndex(n=>n.id===action.payload.id)
            if(id==-1){
                newstate.push(action.payload)
            }else{
                newstate[id].image = action.payload.image;
            }
            return newstate;
        case "SAVE_DESCRIPTION":
            id = state.findIndex(n=>n.id===action.payload.id)
            if(id==-1){
                newstate.push(action.payload)
            }else{
                newstate[id].description = action.payload.description;
            }
            return newstate;
        case "SAVE_DB_INFO":
            id = state.findIndex(n=>n.id===action.payload.id)
            if(id==-1){
                newstate.push(action.payload)
            }else{
                newstate[id].db = action.payload.db;
            }
            return newstate;
        case "SAVE_RATING":
            id = state.findIndex(n=>n.id===action.payload.id)
            if(id!==-1 && newstate[id].db){
                newstate[id].db.rating = action.payload.rating;
            }
            return newstate;
        case "SAVE_PAGENOW":
            id = state.findIndex(n=>n.id===action.payload.id)
            if(id!==-1 && newstate[id].db){
                newstate[id].db.pagenow = action.payload.pagenow;
            }
            return newstate;
        case "SAVE_REVIEW":
           id = state.findIndex(n=>n.id===action.payload.id)
            if(id!==-1 && newstate[id].db){
                newstate[id].db.review = action.payload.review;
            }
            return newstate;
        case "SAVE_NOTES":
            id = state.findIndex(n=>n.id===action.payload.id)
            if(id!==-1 && newstate[id].db){
                newstate[id].db.notes = action.payload.notes;
            }
            return newstate;
        case "UPDATE_NOTE": //{id, notepos, content, time}
            id = state.findIndex(n=>n.id===action.payload.id)
            if(id!==-1 && newstate[id].db){
                newstate[id].db.notes[action.payload.notepos].content = action.payload.content;
                if(state[id].db.notes[action.payload.notepos].time === action.payload.time){
                    newstate[id].db.notes = state[id].db.notes.sort(comp)
                }else{
                    newstate[id].db.notes[action.payload.notepos].time = action.payload.time;
                }
            }
            return newstate;
        case "DELETE_NOTE": //{id, notepos}
            id = state.findIndex(n=>n.id===action.payload.id)
            if(id!==-1 && newstate[id].db){
                // newstate[id].db.notes = state[id].db.notes.map(n=>({...n}))
                newstate[id].db.notes = state[id].db.notes.filter((n,i)=>i!==action.payload.notepos)
            }
            return newstate;
        case 'VALIDATE_NOTE': //{id, date, content}
            id = state.findIndex(n=>n.id===action.payload.id)
            if(id!==-1 && newstate[id].db){
                let notepos = newstate[id].db.notes.findIndex(n=> n.time=== action.payload.date )
                if(notepos==-1){
                    if(action.payload.content!==""){ //create note
                        newstate[id].db.notes.push({time: action.payload.date, content: action.payload.content})
                        newstate[id].db.notes = state[id].db.notes.sort(comp)
                    }
                }else{
                    if(action.payload.content!==""){
                        newstate[id].db.notes[notepos].content = action.payload.content;
                    }else{ //delete empty
                        newstate[id].db.notes = state[id].db.notes.slice(0, notepos).concat(state[id].db.notes.slice(notepos+1, state[id].db.notes.length))
                    }
                    
                }
            }
            return newstate;
        case "CLEARDATA":
            newstate = state.map(n=>{
                let a = {...n}
                a.db = {rating: 0, review: "", notes:[], pagenow:0}
                return a
            })
            return newstate;
        default:
            return state;
    }
}

export default booksInfoReducer;