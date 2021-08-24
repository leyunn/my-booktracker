export const lopen = (remember) =>{ return {type: "LOPEN", payload:{remember}}}
export const lclose = ()=>{ return {type: "LCLOSE"}}
export const aopen = () =>{ return {type: "AOPEN"}}
export const aclose = ()=>{ return {type: "ACLOSE"}}
export const bopen = () =>{ return {type: "BOPEN"}}
export const bclose = ()=>{ return {type: "BCLOSE"}}
export const sopen = () =>{ return {type: "SOPEN"}}
export const sclose = ()=>{ return {type: "SCLOSE"}}
export const sropen = () =>{ return {type: "SROPEN"}}
export const srclose = ()=>{ return {type: "SRCLOSE"}}
export const copen = (title) =>{ return {type: "COPEN", payload:{title}}}
export const cclose = (title)=>{ return {type: "CCLOSE", payload:{title}}}
export const login = (userdata) =>{ return {type: "LOGIN", payload:{userdata}}}
export const logout = ()=>{ return {type: "LOGOUT"}}
export const refresh = (token)=>{ return {type: "REFRESH", payload:{token}}}
export const setTab = (tab)=>{ return {type: "SET_TAB", payload:{tab}}}
export const setsearchInput = (input)=>{ return {type: "SET_SEARCH_INPUT", payload:{input}}}
export const focus = () =>{ return {type: "FOCUS"}}
export const blur = ()=>{ return {type: "BLUR"}}
export const setkeyword = (input)=>{ return {type: "SET_KEYWORD", payload:{input}}}
export const sethomebook = (book)=>{ return {type: "SET_HOMEBOOK", payload:{book}}}
export const loadBookshelves = (bookshelves)=>{ return {type: "LOAD_BOOKSHELVES", payload:{bookshelves}}}
export const loadDefaultshelves = ({id, books})=>{ return {type: "LOAD_DEFAULTSHELVES", payload:{id, books}}}
export const addDefaultBook = ({id, book})=>{ return {type: "ADD_BOOK_DEFAULT", payload:{id, book}}}
export const deleteDefaultBook = ({pos, id})=>{ return {type: "DELETE_BOOK_DEFAULT", payload:{pos,id}}}
export const ssopen = (type)=>{ return {type: "SSOPEN", payload:{type}}}
export const ssclose = ()=>{ return {type: "SSCLOSE"}}
export const setcurrentbook = (book)=>{ return {type: "SET_CURRENTBOOK", payload:{book}}}
export const setcurrentshelf = ({shelf, pos}) => {return {type: "SET_CURRENT_SHELF", payload:{shelf, pos}}}
export const loadbooks = ({books, pos})=>{ return {type: 'LOAD_BOOKS', payload:{books, pos}}}
export const addbook = ({book, pos})=>{ return {type: 'ADD_BOOK', payload:{book, pos}}}
export const deletebook = ({id, pos})=>{ return {type: 'DELETE_BOOK', payload:{id, pos}}}
export const nbopen = () =>{ return {type: "NBOPEN"}}
export const nbclose = ()=>{ return {type: "NBCLOSE"}}
export const saveimage = ({id, image}) => {return {type: 'SAVE_IMAGE', payload:{id,image }}}
export const savedescription = ({id, description}) => {return {type: 'SAVE_DESCRIPTION', payload:{id,description }}}
export const savedbinfo = ({id, db}) => {return {type:'SAVE_DB_INFO', payload:{id, db}}}
export const saverating = ({id, rating}) => {return {type:'SAVE_RATING', payload:{id, rating}}}
export const savepagenow = ({id, pagenow}) => {return {type:'SAVE_PAGENOW', payload:{id, pagenow}}}
export const savereview = ({id, review}) => {return {type:'SAVE_REVIEW', payload:{id, review}}}
export const updatenote = ({id, notepos, content, time}) => {return {type:'UPDATE_NOTE', payload:{id, notepos, content, time}}}
export const deletenote = ({id, notepos}) => {return {type:'DELETE_NOTE', payload:{id, notepos}}}
export const validatenote = ({id, date, content}) =>{return {type: 'VALIDATE_NOTE', payload:{id, date, content}}}
export const rnopen = (start)=>{ return {type: "RNOPEN", payload:{start}}}
export const rnclose = ()=>{ return {type: "RNCLOSE"}}
export const reopen = ()=>{ return {type: "REOPEN"}}
export const reclose = ()=>{ return {type: "RECLOSE"}}
export const neopen = (notepos)=>{ return {type: "NEOPEN", payload:{notepos}}}
export const neclose = (isaved)=>{ return {type: "NECLOSE", payload:{isaved}}}
export const rename = (name)=>{return { type: "RENAME", payload:{name}}}
export const cleardata = () => {return {type:"CLEARDATA"}}
export const sbclose = (clear)=>{ return {type: "SBCLOSE", payload:{clear}}}
export const sbopen = () =>{ return {type: "SBOPEN"}}
export const clearshelf = (pos) => { return {type: "CLEARSHELF", payload:{pos}}}
export const setremember = (yes)=>{return {type: yes?"REMEMBER":"DONT_REMEMBER"}}
export const addsearchHistory = (word) => {return {type: "ADD_SEARCH_HISTORY", payload:{word}}}