import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import MoveIcon from '@material-ui/icons/ArrowForward';
import EditIcon from '@material-ui/icons/Edit';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import read_icon from '../images/read_icon.svg'
import Rating from 'react-rating'
import MenuIcon from '@material-ui/icons/Menu';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {Dialog, Button, DialogContent, DialogActions, IconButton, Divider, Menu, MenuItem, ImageList, ImageListItem, Card, CardContent, CardActions, Tooltip, Fab} from '@material-ui/core';
import { useEffect, useState, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {nbclose, ssopen, copen, rnopen, sethomebook, savedbinfo, saverating, reopen, neopen} from '../actions';
import {message} from 'antd';
import useDB from '../hooks/useDB';
import Revieweditor from './Revieweditor';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const NotesBox = ()=>{

    const dispatch = useDispatch()
    const notesBoxModal = useSelector(state => state.notesBoxModal)
    const noteEditorModal = useSelector(state => state.noteeditorModal)
    const settingModal = useSelector(state => state.settingModal)
    const book = useSelector(state=>state.currentBook);
    const savedbooks = useSelector(state => state.booksInfo)
    const homebook = useSelector(state=>state.homeBook)
    const shelf = useSelector(state=>state.currentshelf)
    const userData = useSelector(state => state.userData)
    const handleClose = () => {dispatch(nbclose())};
    const gridRef = useRef(null)
    const {ratebookDB, getbookDB, updatenotesDB} = useDB()
    const [rating, setrating] = useState(0)
    const [review, setreview] = useState("")
    const [viewerState, setviewerState] = useState("")
    const [notes, setnotes] = useState([])

    useEffect(() => {
      if(notesBoxModal && book.id===homebook.id){
        let bookdata =  savedbooks.find(n=>n.id===book.id);
        if(bookdata?.db){
          setnotes((bookdata.db.notes&& bookdata.db.notes[0])? bookdata.db.notes:[] ) 
        }
      }
    }, [notesBoxModal])


    useEffect(() => {
      if(!settingModal.open && settingModal.clear===1){
        setnotes([])
        setreview("")
        setrating(0)
      }
    }, [settingModal])

    useEffect(() => {
      if(!noteEditorModal.open && noteEditorModal.notepos===-2){
        let bookdata =  savedbooks.find(n=>n.id===book.id);
        if(bookdata?.db){
          setnotes((bookdata.db.notes&& bookdata.db.notes[0])? bookdata.db.notes:[] )
          updatenotesDB({id: book.id, mail: userData.mail, notes: bookdata.db.notes })
        }

      }
    }, [noteEditorModal])

    useEffect(() => {
      const fetchBook = async ()=>{
        const {data, status} = await getbookDB({mail: userData.mail, id: book.id});
        if(status!==200){
          setrating(0)
          setreview("")
          setnotes([])
          return;
        }
        dispatch(savedbinfo({id: book.id, db: data}))
        if(data.rating){
          setrating(data.rating)
        }else{
          setrating(0)
        }
        if(data.review){
          setreview(data.review)
        }else{
          setreview("")
        }
        if(data.notes && data.notes[0]){
          setnotes(data.notes)
        }else{
          setnotes([])
        }
      }

      if(!book.id) return;
      let bookdata =  savedbooks.find(n=>n.id===book.id);
      if(bookdata?.db){
        setrating(bookdata.db.rating? bookdata.db.rating: 0)
        setreview(bookdata.db.review? bookdata.db.review: "")
        setnotes((bookdata.db.notes&& bookdata.db.notes[0])? bookdata.db.notes:[] ) 
      }else{
        fetchBook()
      }


    }, [book])

    useEffect(() => {
      if(review!==""){
        setviewerState(draftToHtml(JSON.parse(review)))
      }
    }, [review])

    const readnow = () => {
      if(homebook.id!==null){
          dispatch(rnopen(true))
      }else{
          dispatch(sethomebook(book))
          handleClose()
          message.success({content: `Homebook is updated.`, style:{marginTop:"90vh"}})
      }
      
  };
    
    return(
        <div>
      <Dialog open={notesBoxModal} onClose={handleClose} fullWidth={true} maxWidth="lg">
        <DialogContent style={{textAlign:"center",height:"95vh", color:"#37474F", fontSize:"30px", overflowY:"hidden"}}>
            <DialogActions style={{marginTop:"0px"}} >
              <p style={{marginRight:"16vw", textAlign:"left", marginBottom:"5px", width:"65vw"}}>
                <span>
                    <Rating
                      initialRating={rating}
                      fullSymbol={<StarIcon size={50} style={{color:(rating>0)?"rgb(243, 216, 65)":'black'}} />}
                      emptySymbol={<StarBorderIcon size={50} style={{color:(rating>0)?"rgb(243, 216, 65)":'black'}} />}
                      onChange={num=>{
                        if(rating!==num){
                          setrating(num)
                          dispatch(saverating({id: book.id, rating: num}))
                          ratebookDB({mail: userData.mail, id: book.id, rating: num})
                        }
                      }}            
                     />                 
                </span>
<span style={{fontSize:"19px", fontWeight:"bold", marginLeft:"20px"}} > {book.volumeInfo? book.volumeInfo.title:""}</span></p>
              {/* <Link  onClick={()=>{
                dispatch(ssopen("Add"))
              }} color="primary" style={{fontSize:"17px", textAlign:"center", lineHeight:'40px', color:'rgb(75, 134, 99)' }}><AddIcon size={20} style={{paddingTop:"10px", color:'rgb(75, 134, 99)'}}/>Add to</Link>
              <Link onClick={()=>{
                dispatch(ssopen("Move"))
              }} color="primary" style={{fontSize:"17px", textAlign:"center", lineHeight:'40px', color:'rgb(24, 98, 163)'}}><MoveIcon size={20} style={{paddingTop:"10px", color:'rgb(24, 98, 163)'}}/>Move to</Link>
              <IconButton style={{height:"40px", width:"40px"}} ><DeleteIcon style={{color:'rgb(156, 50, 50)', height:"28px", width: "28px"}} onClick={()=>{
                dispatch(copen("delete it"))
              }}  /></IconButton > */}
              <PopupState variant="popover" >
                {(popupState) => (
                  <>
                    <IconButton {...bindTrigger(popupState)} style={{height:"40px", width:"40px"}} ><MenuIcon style={{height:"30px", width:"30px"}} color="primary" /></IconButton >
                    <Menu {...bindMenu(popupState)}>
                      <MenuItem onClick={()=>{}} component='div' >
                      <div onClick={()=>{
                        dispatch(ssopen("Add"))
                        popupState.close()
                      }} color="primary" style={{fontSize:"17px", textAlign:"center", lineHeight:'40px', color:'rgb(75, 134, 99)' }}><AddIcon size={20} style={{paddingTop:"10px", color:'rgb(75, 134, 99)'}}/>Add this to other shelf</div>
                      </MenuItem>
                      <MenuItem disabled={shelf.pos===-1} onClick={()=>{}}>
                      <div onClick={()=>{
                        dispatch(ssopen("Move"))
                        popupState.close()
                      }} color="primary" style={{fontSize:"17px", textAlign:"center", lineHeight:'40px', color:'rgb(24, 98, 163)'}}><MoveIcon size={20} style={{paddingTop:"10px", color:'rgb(24, 98, 163)'}}/>Move this to other shelf</div>
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </PopupState>
              
            </DialogActions>
            <Divider/>
            <div style={{height:"90%", width:"85.5vw", marginTop:"10px", display:"flex", flexDirection:"row", justifyContent:"space-between"}} >
              
              <div style={{width:"40vw", overflowY:"hidden"}}>
                <div style={{width:"40vw", height:"100%", marginTop:"10px", overflowY:"scroll"}}>
                {(review!=="")?
                <div id="review_view" style={{ height:"100%", fontSize:"15px", textAlign:"left"}} >
                  <div dangerouslySetInnerHTML={{__html: viewerState}} style={{wordWrap:"break-word"}} ></div>
                  <Button onClick={()=>dispatch(reopen())} id="review_edit_button" color="primary" style={{zIndex:1.1,fontSize:"13px", position:"absolute", top:"84%", left:"20%"}} variant="contained" startIcon={<EditIcon color="secondary" />} >Edit</Button>
                </div>:
                <div>
                  <p style={{marginLeft:"0%", marginTop:"35%", fontSize:"20px"}}>you haven't review it yet.</p>
                <Button onClick={()=>{
                  dispatch(reopen())
                }} color="primary" style={{fontSize:"13px", opacity:0.8}} variant="contained" startIcon={<EditIcon color="secondary" />} >Write your Review</Button>
                </div>
                }
                </div>
              </div>
              <Divider orientation="vertical" flexItem />
              <div ref={gridRef} style={{width:"45vw", paddingLeft:"5px",overflowX:"hidden", overflowY:"scroll", height:"100%"}} >
                <ImageList cols={(gridRef.current)? gridRef.current.offsetWidth/317: 2} rowHeight={125} gap={10}  >
                    
                      {notes.map((n,i)=>(
                        <ImageListItem>
                        <Card key={i} className="note_view" style={{backgroundColor:"rgb(250, 249, 246)", height:"115px"}} >
                        <CardContent>
                          <p style={{marginRight:"7px", color:"darkgray", fontSize:"15px", textAlign:"left",  marginBottom:"0px", marginTop:"0px"}}>{n.time.replaceAll("-",'/')}</p>
                          <p style={{fontSize:"15px", textAlign:"left", wordWrap:"break-word", whiteSpace:"pre-wrap", overflowY:"scroll", height:"70px"}}>{n.content}</p>
                        </CardContent>
                        <CardActions >
                          <Tooltip title="edit note" >
                            <IconButton className="edit_note_button" onClick={()=>{dispatch(neopen(i))}} style={{height:"30px", width:"30px", position:"absolute", left:"89%", top:"67%"}} >
                              <EditIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                          
                        </CardActions>
                      </Card>
                      </ImageListItem>
                      ))} 
                </ImageList>
                <Tooltip title="add note" >
                  <Fab onClick={()=>dispatch(neopen(-3))} id="add_note_button" color="primary" style={{position:"absolute", left:"90%", top:"80%"}} ><AddIcon /></Fab>
                </Tooltip>
              </div>
            </div>
            
        </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{fontSize:"13px", backgroundColor:"rgb(156, 50, 50)", margin:"0px 11px 10px 0px"}} color="primary" startIcon={<DeleteIcon color="secondary" />} onClick={()=>{
                dispatch(copen("delete it"))
              }} >{(shelf.pos!==-1)?"delete from shelf":"delete from home"}</Button>
            <Button disabled={shelf.pos===-1} variant="contained" style={{fontSize:"13px", margin:"0px 11px 10px 0px",  zIndex:3}} color="primary" startIcon={<img src={read_icon} style={{marginTop:"0px", height:'27px', width:"27px", opacity:(shelf.pos==-1)? "50%":"100%"}}/>} onClick={readnow} >read now</Button>
          </DialogActions>
      </Dialog>
      <Revieweditor review={review} setreview={setreview} />

    </div>
    )
}

export default NotesBox;