import './App.css';
import {Tabs, Tab, AppBar, Input, Button} from '@material-ui/core';
import { Switch, Route, Link, BrowserRouter} from "react-router-dom";
import {useState, useEffect, useRef, useCallback} from 'react'
import Home from './pages/Home';
import Mybooks from './pages/Mybooks';
import Search from './pages/Search';
import icon from './images/bookTracker_logo.png'
import ColorTheme from './ColorTheme';
import { ThemeProvider } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import useWindowSize from './hooks/useWindowSize';
import MenuPopupState from './components/MenuPopupState';
import LogInForm from './components/LogInForm';
import SignInForm from './components/SignInForm';
import SearchResult from './components/SearchResult';
import SelectShelfBox from './components/SelectshelfBox';
import {useSelector, useDispatch} from 'react-redux';
import {lopen, aopen, sropen, setsearchInput, setTab, setkeyword, setremember} from './actions';
import Book from './components/Book';
import NotesBox from './components/NotesBox';
import ConfirmBox from './components/ComfirmBox';
import ReadnowBox from './components/ReadnowBox';
import Noteeditor from './components/Noteeditor';

function App() {
  const dispatch = useDispatch();
  const logIn = useSelector(state => state.logIn);
  const bookSearchFocus = useSelector(state => state.bookSearchFocus)
  const searchInput = useSelector(state => state.bookSearchInput)
  const tab = useSelector(state => state.tab)
  const [start, setstart] = useState(false);
  //tabs
  const allTabs = ['/','/Home', '/MyBooks'];
  useEffect(() => {
    if(start) return;
    dispatch(setTab(allTabs.findIndex(n=>n===window.location.pathname)))
    let saveduser = localStorage.getItem("user")
    if(saveduser){
      dispatch(lopen(3))
      
    }else{
      dispatch(setremember(false))
    }
    setstart(true);
  }, [start])
  useEffect(() => {
    if(searchInput!=="") dispatch(setsearchInput(""))
  }, [tab])

  //search bar extention
  const [searchInputlength, setsearchInputlength] = useState("120px");
  const [searchInputmargin, setsearchInputmargin] = useState("43.5vw");
  const { width } = useWindowSize();
  const [searchInputtransition, setsearchInputtransition] = useState("0.3s")
  const [windowState, setwindowState] = useState((width>1425)?1:3);
  useEffect(() => {
    if(width>1425 && windowState>=2){
      setsearchInputmargin("43.5vw");
      setsearchInputtransition("0.3s");
      if(windowState===2) setwindowState(0)
        else setwindowState(1)
    }
    if(width<=1425){
      if(windowState<=1){
        // setsearchInputlength("0px")
        if(windowState===0) setwindowState(2)
        else setwindowState(3)
        setsearchInputtransition("0s");
      }
      if(width>=780)
        setsearchInputmargin(`${width-780}px`)
    }
  }, [width])
  const searchRef = useRef(null);


  //handle enter
  const [enter, setenter] = useState(null)
  const handleKeyPress = useCallback(event => {
    const { key } = event;
    if(key==='Enter') setenter(true)
  },[]);
  useEffect(() => {
    if(enter){
      if(windowState%2===0 && searchInput!==""){
        dispatch(setkeyword(searchInput));
        dispatch(sropen());
      }else if(sropen&&bookSearchFocus&&searchInput!==""){
        dispatch(setkeyword(searchInput));
      }
      setenter(false);
    }
  }, [enter])
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {window.removeEventListener('keydown', handleKeyPress);};
  }, [handleKeyPress]);




  return (
    <ThemeProvider theme={ColorTheme}>
    <BrowserRouter>
      <div className="App" style={{backgroundColor:(tab===0)? "#37474F":"", overflowY:"hidden"}}>
        <Route
          path="/"
          render={({ location }) => (
            <>
              <AppBar className="bar" position="fixed" style={{backgroundColor:"white",color:"black"}}>
              <Tabs value={allTabs[tab]} indicator="true" indicatorColor="primary" onChange={(a)=>{
                if(a.target===searchRef.current) dispatch(setsearchInput(a.target.value))
              }} >
              <img onClick={()=>dispatch(aopen())} alt="logo" className="icon" src={icon} style={{height:"22px", width:"30px", marginTop:"12px"}} />
                <Tab label="Search" value={allTabs[0]} component={Link} to={allTabs[0]} onClick={()=>{if(tab!== 0) dispatch(setTab(0))}} />
                <Tab label="Home" value={allTabs[1]} component={Link} to={allTabs[1]} onClick={()=>{if(tab!== 1) dispatch(setTab(1))}} />
                <Tab label="My books" value={allTabs[2]} component={Link} to={allTabs[2]} onClick={()=>{if(tab!== 2) dispatch(setTab(2))}} />
                {(location.pathname!=="/")?
                <Input inputRef={searchRef} className="search" style={{width: searchInputlength, marginLeft: searchInputmargin, transition:searchInputtransition}} placeholder="search books" value={searchInput} type="text"
                  onFocus={()=>{
                    if(windowState<=1){
                      setsearchInputlength("200px");
                      setsearchInputmargin("37.9vw")
                      setwindowState(0)
                    }else if(windowState===3) setwindowState(2)
                  }}
                  onBlur={()=>{
                    if(windowState<=1){
                      setsearchInputlength("120px");
                      setsearchInputmargin("43.5vw")
                      dispatch(setsearchInput(""));
                      setwindowState(1)
                    }else if(windowState===2) setwindowState(3)
                  }}
                  />:<div style={{width:"120px", marginLeft: searchInputmargin}} ></div>}
                {(location.pathname!=="/")? <SearchIcon style={{filter: "invert(23%) sepia(15%) saturate(701%) hue-rotate(155deg) brightness(100%) contrast(90%)"}} className="searchicon" onClick={()=>{
                  if(searchInput!==""){
                    dispatch(setkeyword(searchInput));
                    dispatch(sropen());
                  }}} />:<div style={{width:"34px"}}></div>}
                {(!logIn)?<Button className="login" onClick={()=>dispatch(lopen())}>Log In</Button>:<MenuPopupState />}
                
              </Tabs>
              </AppBar><LogInForm /><SignInForm /><SearchResult /><SelectShelfBox /><Book /><NotesBox/><ConfirmBox /><ReadnowBox/><Noteeditor/>
              <Switch>
                <Route path={allTabs[1]} render={() => <Home /> } />
                <Route path={allTabs[2]} render={() => <Mybooks />}/>
                <Route path={allTabs[0]} render={() => <Search  />} />
              </Switch>
            </>
          )}
        />
      </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
