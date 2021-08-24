const reviewEditorModalReducer = (state=false, action) => {
    switch(action.type){
        case "REOPEN":
            return true;
        case "RECLOSE":
            return false;
        default:
            return state;
    }
}

export default reviewEditorModalReducer;