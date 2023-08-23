const settingReducer = (state={open: false, clear: -1}, action) => {
    switch(action.type){
        case "SBOPEN":
            return {open: true, clear: -1};
        case "SBCLOSE":
            return {open: false, clear: action.payload.clear};
        default:
            return state;
    }
}

export default settingReducer;