const keywordReducer = (state=0, action) => {
    switch(action.type){
        case "SET_KEYWORD":
            return action.payload.input;
        default:
            return state;
    }
}

export default keywordReducer;