import ColorTheme from '../ColorTheme';
import { ThemeProvider } from '@material-ui/styles';
import {Dialog, DialogContent, Link, Input, ImageList, ImageListItem} from '@material-ui/core';
import { useState, useEffect, useRef } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Alert, AlertTitle, Skeleton, Pagination } from '@material-ui/lab';
import useApi from '../hooks/useApi';
import { Empty} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {srclose, setkeyword, setsearchInput, focus, blur, bopen, setcurrentbook, addsearchHistory } from '../actions';


const SearchResult = ()=>{
    const dispatch = useDispatch();
    const handleClose = () => {dispatch(srclose())};
    const searchResultModal = useSelector(state => state.searchResultModal)
    const keyword = useSelector(state => state.keyword)
    const searchInput = useSelector(state => state.bookSearchInput)
    const resultTop = useRef(null)
    const scroll = async () => {await resultTop.current?.scrollIntoView({behavior: "smooth"})};
    const [loading, setloading] = useState(false)
    const [page, setpage] = useState(1);
    const [pageCount, setpageCount] = useState(1);
    const [openbook, setopenbook] = useState({})
    const {searchAll, searchdata} = useApi();
    useEffect(() => {
        setloading(false)
        setpageCount(Math.floor(searchdata.total/40))
    }, [searchdata])
    useEffect(() => {
        setloading(true);
        if(keyword=="") return;
        searchAll({keyword, page});
    }, [page])
    useEffect(() => {
        //query data
        setpage(1);
        if(keyword=="") return;
        setloading(true);
        searchAll({keyword, page:1});
        dispatch(addsearchHistory(keyword))
    }, [keyword])
    useEffect(() => {
        dispatch(setcurrentbook(openbook))
    }, [openbook])
    return(
        <ThemeProvider theme={ColorTheme}>
        <div>
      <Dialog open={searchResultModal} onClose={handleClose}  fullWidth={true} maxWidth="md">
        <DialogContent style={{textAlign:"center",height:"95vh", padding:"20px", color:"#37474F", fontSize:"30px", overflowY:"scroll"}}>
            <div ref={resultTop} style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <p style={{marginBottom:"10px", marginLeft:"10px"}}>{(loading)? "Searching":"Results"} for <span>"{keyword}"</span>...</p> 
                <div style={{marginBottom:"20px", height:"50px", position:"relative"}}>
                <Input placeholder="search books" value={searchInput}  style={{width:"270px", marginRight:"40px"}}
                    onFocus={()=>dispatch(focus())}
                    onBlur={()=>dispatch(blur())}
                    onChange={(e)=>dispatch(setsearchInput(e.target.value))}
                />
                <SearchIcon fontSize="large" style={{filter: "invert(23%) sepia(15%) saturate(701%) hue-rotate(155deg) brightness(100%) contrast(90%)", color:"black", position:"absolute", bottom:0, right:5, paddingTop:"5px"}} className="searchicon" onClick={()=>{
                    if(searchInput!="") dispatch(setkeyword(searchInput));
                  }} />
                </div>
            </div>
            <ImageList rowHeight={250} cols={2} gap={30}>
                {(!loading)? ((searchdata.status==200)? ((searchdata.data!="")? searchdata.data.map((n, i) => (
                    (n.volumeInfo)?
                    <ImageListItem key={i}>
                        <div id={n.id} style={{height:"220px", paddingTop:"10px", display:'flex', flexDirection:"row"}} onClick={()=>{
                            setopenbook(n)
                            dispatch(bopen())
                        }}>
                            {/* <div style={{marginLeft:"10px",height:"198px", width:"128px", backgroundColor:"white"}}> </div> */}
                            <img alt={(n.volumeInfo.title)? n.volumeInfo.title.slice(0,25):""} src={(n.volumeInfo.imageLinks)? n.volumeInfo.imageLinks.thumbnail:"" } style={{marginLeft:"10px",height:"198px", width:"128px"}} />
                            <div style={{marginLeft:"15px", width:"282px",  overflowY:"scroll", textAlign:"left"}}>
                                <p style={{fontSize:"24px", textAlign:"left", lineHeight:"26px", paddingTop:"14px", marginBottom:"12px", fontWeight:'bold'}}>{(n.volumeInfo.title)? n.volumeInfo.title.slice(0,32):""}{(n.volumeInfo.title&& n.volumeInfo.title.length>32)?"...":""}<span style={{paddingLeft:"4px", fontSize:"16px", textAlign:"left", fontWeight:"normal"}}></span></p>
                                <p style={{fontSize:"14px", textAlign:"left", lineHeight:"13px",color:"gray" }}><Link style={{color:"grey"}}>{(n.volumeInfo.authors)? n.volumeInfo.authors[0]:""}</Link><span style={{marginLeft:"3px"}}>{n.volumeInfo.publishedDate}</span></p>
                                <p style={{fontSize:"13px", lineHeight:"15px", textAlign:"left", marginBottom:"0px"}}>
                                    {(n.volumeInfo.description)? n.volumeInfo.description.slice(0, 190):""}
                                    {(n.volumeInfo.description && n.volumeInfo.description.length>190)? <Link style={{color:"rgb(24, 98, 163)", fontSize:"13px", lineHeight:"15px", textAlign:"left", marginLeft:"8px"}}>...see more</Link>:""}
                                </p>
                            </div>
                        </div>
                    </ImageListItem>:
                   <ImageListItem></ImageListItem>
                )):<div style={{margin:"auto", marginTop:"180px"}}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    <p style={{fontSize:"25px", color:"#37474F"}}>no matching result.</p>
                </div>
                ):<div>
                    <div style={{margin:"auto", marginTop:"180px"}}>
                    <Alert severity="error" style={{marginLeft:"200px", width:"500px"}}>
                        <AlertTitle style={{fontSize:"19px", textAlign:"left"}} >Error {searchdata.status} ({(searchdata.data)? searchdata.data.statusText:""})</AlertTitle>
                            <p style={{fontSize:"14px"}}>something went wrong with the server, please try again later</p>
                        </Alert>
                    </div>
                </div>):
                    [0,0,0,0,0,0,0,0,0,0].map((n, i)=>(
                        <ImageListItem key={i}>
                        <div onClick={()=>{}} style={{height:"220px", paddingTop:"10px", display:'flex', flexDirection:"row"}}>
                            <Skeleton variant="rect" width={128} height={198} style={{marginLeft:"10px"}} />
                            <div style={{marginLeft:"15px", width:"282px",  overflowY:"scroll", textAlign:"left"}}>
                                <Skeleton variant="rect" height={25} width={190} style={{marginBottom:"40px"}} />
                                <Skeleton variant="text" height={18} />
                                <Skeleton variant="text" height={18} />
                                <Skeleton variant="text" height={18} />
                                <Skeleton variant="text" height={18} />
                                <Skeleton variant="text" height={18} />
                            </div>
                        </div>
                        </ImageListItem>
                    ))
                }
            </ImageList>
            {(searchdata.data!="" && searchdata.status==200)? <Pagination color="primary" style={{marginLeft:"300px"}} count={pageCount} page={page} onChange={(n,i)=>{setpage(i);scroll()}} />:<></>}
        </DialogContent>
      </Dialog>
    </div>
    </ThemeProvider>
    )
}

export default SearchResult;