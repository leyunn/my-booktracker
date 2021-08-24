const tabReducer = (state=0, action) => {
    switch(action.type){
        case "SET_TAB":
            return action.payload.tab;
        default:
            return state;
    }
}

export default tabReducer;