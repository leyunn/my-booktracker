const bookDetailModalReducer = (state=false, action) => {
    switch(action.type){
        case "BOPEN":
            return true;
        case "BCLOSE":
            return false;
        default:
            return state;
    }
}

export default bookDetailModalReducer;