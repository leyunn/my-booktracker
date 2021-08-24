const readnowModalReducer = (state={open: false, start: false}, action) => {
    switch(action.type){
        case "RNOPEN":
            return {open: true, start: action.payload.start};
        case "RNCLOSE":
            return {open: false, start: state.start};
        default:
            return state;
    }
}

export default readnowModalReducer;