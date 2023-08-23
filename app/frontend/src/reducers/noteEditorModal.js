const noteEditorModalReducer = (state={open: false, notepos: -1}, action) => {
    switch(action.type){
        case "NEOPEN":
            return {open: true, notepos: action.payload.notepos };
        case "NECLOSE":
            return {open: false, notepos: action.payload.isaved };
        default:
            return state;
    }
}

export default noteEditorModalReducer;