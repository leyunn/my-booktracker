const remembermeReducer = (state=true, action) => {
    switch(action.type){
        case "REMEMBER":
            return true;
        case "DONT_REMEMBER":
            return false;
        default:
            return state;
    }
}

export default remembermeReducer;