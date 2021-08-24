const selectShelfReducer = (state={open: false, type:'Add'}, action) => {
    switch(action.type){
        case "SSOPEN":
            return {open: true, type: action.payload.type};
        case "SSCLOSE":
            return {open: false, type: state.type};
        default:
            return state;
    }
}

export default selectShelfReducer;