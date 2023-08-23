const confirmModalReducer = (state={open: false, title:''}, action) => {
    switch(action.type){
        case "COPEN":
            return {open: true, title: action.payload.title};
        case "CCLOSE":
            return {open: false, title: (action.payload?.title)? action.payload.title:state.title};
        default:
            return state;
    }
}


export default confirmModalReducer;