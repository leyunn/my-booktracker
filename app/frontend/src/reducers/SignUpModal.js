const signUpModalReducer = (state=false, action) => {
    switch(action.type){
        case "SOPEN":
            return true;
        case "SCLOSE":
            return false;
        default:
            return state;
    }
}

export default signUpModalReducer;