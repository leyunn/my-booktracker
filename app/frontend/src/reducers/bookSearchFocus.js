const bookSearchFocusReducer = (state=false, action) => {
    switch(action.type){
        case "FOCUS":
            return true;
        case "BLUR":
            return false;
        default:
            return state;
    }
}

export default bookSearchFocusReducer;