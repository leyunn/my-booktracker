const homeBookReducer = (state={id: null}, action) => {
    let newstate = {...state};
    switch(action.type){
        case "SET_HOMEBOOK":
            return action.payload.book;
        // case "WRITE_HOME_NOTE":
        //     const {time, content} = action.payload;
        //     let index = newstate.notes.findIndex(n=>n.time==time);
        //     if(index==-1){ //no note
        //         newstate.notes.push({time,content});
        //         newstate.notes.sort((a,b)=>a.time - b.time)
        //     }else{ //note exist
        //         if(content=="") newstate.notes = newstate.notes.slice(0, index).concat(newstate.notes.slice(index+1, newstate.notes.length))
        //         else newstate.notes[index].content = content;
        //     }
        //     return newstate;
        default:
            return state;
    }
}

export default homeBookReducer;