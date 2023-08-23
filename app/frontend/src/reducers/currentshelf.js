const currentShelfReducer = (state={id:0, pos:0, volumeCount:0}, action) => {
    switch(action.type){
        case "SET_CURRENT_SHELF":
            let newstate = action.payload.shelf;
            newstate.pos = action.payload.pos;
            return newstate;
        default:
            return state;
    }
}

export default currentShelfReducer;