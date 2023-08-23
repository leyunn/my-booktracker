
import AddIcon from '@material-ui/icons/Add';
import {Dialog, Button, DialogContent, Link, DialogActions, CircularProgress} from '@material-ui/core';
import { useEffect, useState } from 'react';
import {message} from 'antd';
import useApi from '../hooks/useApi';
import {useSelector, useDispatch} from 'react-redux';
import {bclose, ssopen, saveimage, savedescription, rnopen, sethomebook, srclose, rnclose } from '../actions';


const Book = ()=>{


    const dispatch = useDispatch()
    const bookDetailModal = useSelector(state => state.bookDetailModal)
    const searchResultModal = useSelector(state => state.searchResultModal)
    const images = useSelector(state => state.booksInfo)
    const book = useSelector(state=>state.currentBook);
    const homebook = useSelector(state=>state.homeBook)
    const logIn = useSelector(state=>state.logIn)
    const {getDetail} = useApi();
    const [loading, setloading] = useState(false)
    const [dloading, setdloading] = useState(true)
    const [imglink, setimglink] = useState("")
    const [description, setdescription] = useState("");
    const handleClose = () => {dispatch(bclose())};
    
    useEffect(() => {
      async function fetchData() {
        if(!book.id) return;
      let bookdata =  images.find(n=>n.id===book.id);
      if(bookdata && bookdata.image){
        setimglink(bookdata.image)
        setdescription((bookdata.description)? bookdata.description: book.volumeInfo?.description)
      }else{
        setloading(true)
        setdloading(true)
      const {data, status} = await getDetail(book.id);
      if (status!==200 || !data.volumeInfo) {
        setimglink(book.volumeInfo? book.volumeInfo.imageLinks? book.volumeInfo.imageLinks.thumbnail:"":"");
        if(description===(book.volumeInfo? book.volumeInfo.description:"")) setdloading(false);
        else setdescription(book.volumeInfo? book.volumeInfo.description:"")
        return;
      }else{
        if(!data.volumeInfo.imageLinks || !data.volumeInfo.imageLinks.small) {
          setimglink(book.volumeInfo? book.volumeInfo.imageLinks? book.volumeInfo.imageLinks.thumbnail:"":"");
        }else{
          let img = new Image();
          img.src = data.volumeInfo.imageLinks.small;
          img.onload = (n) => {
            if(n.target.naturalHeight > n.target.naturalWidth) setimglink(data.volumeInfo.imageLinks.small)
            else setimglink(book.volumeInfo? book.volumeInfo.imageLinks? book.volumeInfo.imageLinks.thumbnail:"":""); 
          }
        }
        if(!data.volumeInfo.description){
          if(description===(book.volumeInfo? book.volumeInfo.description:"")) setdloading(false);
          else setdescription(book.volumeInfo? book.volumeInfo.description:"");
        } else if(description===data.volumeInfo.description) setdloading(false);
        else setdescription(data.volumeInfo.description)
      }
      }
    }
    fetchData();
    }, [book])

    useEffect(() => {
      if(loading&& book.id){
        dispatch(saveimage({id: book.id, image: imglink}))
        setloading(false)
      }
    }, [imglink])
    useEffect(() => {
      if(dloading&& book.id){
      dispatch(savedescription({id:book.id, description}))
      setdloading(false)
    } }, [description])
    return(
        <div>
      <Dialog open={bookDetailModal} onClose={handleClose}  fullWidth={true} maxWidth="md">
        <DialogContent style={{textAlign:"center",height:"95vh", padding:"20px", color:"#37474F", fontSize:"30px"}}>
        {(book.volumeInfo)? <>
          <div className="home-main" >
          <div className="info">
            <div style={{height:"130px", overflow:"scroll"}}>
            <p style={{ textAlign:"left", lineHeight:(book.volumeInfo.title.length<=40)?"33px":`${33-(book.volumeInfo.title.length-40)/6}px`, marginBottom:(book.volumeInfo.title.length<=40)?"19px":`${19-(book.volumeInfo.title.length-40)/8}px`}}><span style={{fontSize:(book.volumeInfo.title.length<=40)?"30px":`${30-(book.volumeInfo.title.length-40)/7}px`, fontWeight:"bold", color:"#37474F"}}>{book.volumeInfo.title}</span></p>
            <p style={{fontSize:(book.volumeInfo.title.length<=40)?"15px":`${15-(book.volumeInfo.title.length-40)/35}px`, textAlign:"left", lineHeight:"17px",color:"gray", marginBottom:"15px" }}><Link style={{color:"grey"}}>{(book.volumeInfo.authors)? book.volumeInfo.authors.map((n,i)=><span key={i}>{n}</span>):""}</Link>
              <span style={{marginLeft:"10px"}}>({book.volumeInfo.publishedDate})</span>
            </p>
            </div>
            {dloading? <div style={{margin:'auto', marginTop:"180px"}}><CircularProgress/></div>: <div dangerouslySetInnerHTML={{__html: description}} style={{ width:"480px", height:"425px", overflowY:'scroll', textAlign:"left" ,fontSize:"14px"}} />}
            {dloading? <></>:<Link target="_blank" style={{fontSize:"14px", color:"rgb(24, 98, 163)"}} href={book.volumeInfo.previewLink}>see Preview at Google books</Link>}
            {/* <Link target="_blank" style={{fontSize:"14px"}} href={book.selfLink}>Data</Link> */}
          </div>
          <div className="info">
            <div style={{textAlign:"right", display:"flex", flexDirection:"column", color:"black"}}>
              {(!loading)? <img alt={(book.volumeInfo.title)? book.volumeInfo.title.slice(0,25):""} src={imglink} style={{height:"396px",width:"256px", flexGrow:0, flexShrink:0, margin:'auto'}} />:
              <div style={{height:"396px",width:"256px", flexGrow:0, flexShrink:0, margin:'auto'}}><CircularProgress style={{marginTop:"140px", marginRight:"100px"}} /></div> }
              <p style={{textAlign:"center", fontSize:"12px",marginTop:"7px",  marginBottom:"75px"}}> {book.volumeInfo.pageCount} {(book.volumeInfo.pageCount)? " pages":""}</p>
              {(logIn && searchResultModal)? <>
                <Button onClick={()=>{
                  if(homebook.id!==null) dispatch(rnopen(true))
                  else{
                    
                    dispatch(sethomebook(book))
                    dispatch(bclose())
                    dispatch(srclose())
                    dispatch(rnclose())
                    message.success({content: `Homebook is updated.`, style:{marginTop:"90vh"}})
                  }
                  
                }} style={{marginTop:"27px", flexGrow:0, flexShrink:0, width:"240px", margin:'auto'}} color="primary" variant="contained" size="large" >READ NOW</Button>
                <Link onClick={()=>{
                  dispatch(ssopen("Add"))
                }} color="primary" style={{marginRight:"35px", fontSize:"17px", textAlign:"center", lineHeight:'40px', marginTop:"10px"}}><AddIcon size={20} style={{paddingTop:"10px"}}/> Add to bookshelf</Link>
              </>:<></>}
            </div>
          </div>
         </div>
         </>:
      <div style={{margin:'auto', marginTop:"170px"}}>
        <p>no such book</p>
      </div>}
        </DialogContent>
          <DialogActions>
            <Button size="small" style={{color:"rgb(24, 98, 163)", fontSize:"12px", textAlign:"center",marginRight:"450px", marginBottom:"5px"}} onClick={handleClose} variant="outlined" >Back</Button>
          </DialogActions>
      </Dialog>
    </div>
    )
}

export default Book;