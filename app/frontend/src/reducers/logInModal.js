const loginformReducer = (state=false, action) => {
    switch(action.type){
        case "LOPEN":
            return (action.payload.remember)? action.payload.remember:true;
        case "LCLOSE":
            return false;
        default:
            return state;
    }
}

export default loginformReducer;