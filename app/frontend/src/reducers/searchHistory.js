const searchHistoryReducer = (state=[], action) => {
    let newstate = [...state];
    switch(action.type){
        case "ADD_SEARCH_HISTORY":
            let exist = newstate.find(n=>n===action.payload.word)
            if(!exist){
                newstate.push(action.payload.word)
            }
            return newstate;
        default:
            return state;
    }
}

export default searchHistoryReducer;