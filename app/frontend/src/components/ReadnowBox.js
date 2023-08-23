import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import {message} from 'antd';
import EditIcon from '@material-ui/icons/Edit';
import {rnclose, nbclose, addbook, addDefaultBook, srclose, bclose, sethomebook, nbopen, setcurrentbook} from '../actions';
import useApi from '../hooks/useApi';

export default function ReadnowBox() {
  const dispatch = useDispatch();
  const modal = useSelector(state => state.readnowModal)
  const homebook = useSelector(state => state.homeBook)
  const currentbook = useSelector(state => state.currentBook)
  const userData = useSelector(state => state.userData)
  const {addBook} = useApi();
  

  

  const add_to_queue = async ()=>{
    const status = await addBook(3 ,currentbook.id,userData.token)
    if(status<300){
      dispatch(addDefaultBook({id:0, book: currentbook }))
      dispatch(addbook({book: currentbook,pos: 2}))
      message.success({content: `The book have been added.`, style:{marginTop:"90vh"}})
    }else{
      message.error({content: `failed to add, try again`, style:{marginTop:"90vh"}})
    }
    dispatch(rnclose())
    dispatch(nbclose())
    dispatch(srclose())
    dispatch(bclose())
  }

  
  return (
    <div>
      <Dialog open={modal.open} >
        {(modal.start)?
          <>
            <DialogTitle style={{width:"500px"}} >You are currently reading {homebook.volumeInfo? homebook.volumeInfo.title:""}. </DialogTitle>
            <DialogContent >
            <p style={{marginTop:"15px", marginBottom:"15px"}} >Do you want to replace it or add this to "Reading Now"?</p>
            </DialogContent>
            <DialogActions style={{marginBottom:"3px"}}>
              <Button size="small" onClick={()=>dispatch(rnclose())} color="primary">Cancel</Button>
              <Button size="small" onClick={add_to_queue} color="primary" variant="contained">Add to Reading now</Button>
              <Button style={{backgroundColor:"rgb(24, 98, 163)"}} size="small" onClick={()=>{
                  dispatch(sethomebook(currentbook))
                  dispatch(rnclose())
                  dispatch(nbclose())
                  dispatch(srclose())
                  dispatch(bclose())
                  message.success({content: `You have started reading. Check out your home page.`, style:{marginTop:"90vh"}})
              }} color="primary" variant="contained">Replace</Button>
            </DialogActions>
          </>:
          <>
          <DialogTitle style={{width:"700px"}} >You have reach the end of the book!</DialogTitle>
          <DialogContent>
            Do you want to keep reading or read something else?
            Or you can write a review or rate the book.
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{
              dispatch(rnclose())
            }} color="primary">read again</Button>
            <Button onClick={()=>{
                dispatch(setcurrentbook(homebook))
                dispatch(nbopen())
                dispatch(rnclose())
              }} style={{backgroundColor:"rgb(24, 98, 163)"}} color="primary" variant="contained" startIcon={<EditIcon color="secondary" />} >Write Review</Button>
              <Button onClick={()=>{
                dispatch(rnclose())
                dispatch(sethomebook({id:null}))
                message.success({content: `You have finished the book.`, style:{marginTop:"90vh"}})
              }} color="primary" variant="contained"  >Done</Button>
          </DialogActions>
        </>
        }
      </Dialog>
    </div>
  );
}