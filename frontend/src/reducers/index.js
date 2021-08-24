import {combineReducers} from 'redux';
import loginReducer from "./logIn";
import loginformReducer from "./logInModal";
import signUpModalReducer from './SignUpModal';
import confirmModalReducer from './confirmModal';
import searchResultModalReducer from './searchResultModal';
import bookDetailModalReducer from './bookDetailModal';
import aboutModalReducer from './aboutModal';
import tabReducer from './tab';
import bookSearchInputReducer from './bookSearchInput';
import bookSearchFocusReducer from './bookSearchFocus';
import userDataReducer from './userData';
import keywordReducer from './keyword';
import homeBookReducer from './homebook';
import bookShelvesReducer from './bookShelves';
import defaultShelvesReducer from './defaultShelves';
import selectShelfReducer from './selectshelfModal';
import currentBookReducer from './currentbook';
import currentShelfReducer from './currentshelf';
import notesBoxModalReducer from './notesBoxModal';
import booksInfoReducer from './booksInfo';
import readnowModalReducer from './readnowModal';
import reviewEditorModalReducer from './reviewEditorModal';
import noteEditorModalReducer from './noteEditorModal';
import settingReducer from './settingBox';
import remembermeReducer from './rememberme';
import searchHistoryReducer from './searchHistory';

const allReducers = combineReducers({
    logIn : loginReducer,
    logInModal : loginformReducer,
    signUpModal : signUpModalReducer,
    confirmModal: confirmModalReducer,
    searchResultModal: searchResultModalReducer,
    bookDetailModal: bookDetailModalReducer,
    aboutModal: aboutModalReducer,
    tab: tabReducer,
    bookSearchInput: bookSearchInputReducer,
    bookSearchFocus: bookSearchFocusReducer,
    userData: userDataReducer,
    keyword: keywordReducer,
    homeBook: homeBookReducer,
    currentBook: currentBookReducer,
    bookshelves: bookShelvesReducer,
    defaultshelves: defaultShelvesReducer,
    selectShelfModal: selectShelfReducer,
    currentshelf: currentShelfReducer,
    notesBoxModal: notesBoxModalReducer,
    booksInfo: booksInfoReducer,
    readnowModal: readnowModalReducer,
    revieweditorModal: reviewEditorModalReducer,
    noteeditorModal: noteEditorModalReducer,
    settingModal: settingReducer,
    rememberme: remembermeReducer,
    searchHistory: searchHistoryReducer,
})  

export default allReducers;