const searchResultModalReducer = (state=false, action) => {
    switch(action.type){
        case "SROPEN":
            return true;
        case "SRCLOSE":
            return false;
        default:
            return state;
    }
}

export default searchResultModalReducer;