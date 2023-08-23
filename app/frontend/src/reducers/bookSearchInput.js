const bookSearchInputReducer = (state="", action) => {
    switch(action.type){
        case "SET_SEARCH_INPUT":
            return action.payload.input;
        default:
            return state;
    }
}

export default bookSearchInputReducer;