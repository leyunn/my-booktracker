const aboutModalReducer = (state=false, action) => {
    switch(action.type){
        case "AOPEN":
            return true;
        case "ACLOSE":
            return false;
        default:
            return state;
    }
}

export default aboutModalReducer;