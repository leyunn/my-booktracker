const userDataReducer = (state={}, action) => {
    let newstate = state;
    switch(action.type){
        case "LOGIN":
            return action.payload.userdata;
        case "REFRESH_TOKEN":
            newstate.token = action.payload.token;
            return newstate;
        case "RENAME":
            newstate.name = action.payload.name;
            return newstate
        default:
            return state;
    }
}

export default userDataReducer;