const notesBoxModalReducer = (state=false, action) => {
    switch(action.type){
        case "NBOPEN":
            return true;
        case "NBCLOSE":
            return false;
        default:
            return state;
    }
}

export default notesBoxModalReducer;