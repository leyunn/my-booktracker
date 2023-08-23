import { useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Select, MenuItem} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import {message} from 'antd';
import {ssclose, bclose,srclose, addDefaultBook, addbook, nbclose, deletebook, deleteDefaultBook, clearshelf, sbclose} from '../actions';
import useApi from '../hooks/useApi';


export default function SelectShelfBox() {
  const {addBook, moveBook, clearShelf} = useApi();
  const dispatch = useDispatch();
  const modal = useSelector(state => state.selectShelfModal)
  const currentshelf = useSelector(state=> state.currentshelf)
  const bookshelves = useSelector(state => state.bookshelves)
  const currentbook = useSelector(state => state.currentBook)
  const userData = useSelector(state => state.userData)
  const [shelf, setshelf] = useState(0);
  const handleChange = e=>setshelf(e.target.value)

  const showerror = ()=>{
    message.error({content: `operation failed, try again`, style:{marginTop:"90vh"}})
  }


  const add = async ()=>{
    // console.log("add", currentbook,"to", shelf)
    const status = await addBook(shelf,currentbook.id,userData.token)
    if(status<300){
      if(shelf==3) dispatch(addDefaultBook({id:0, book: currentbook }))
      else if(shelf==2) dispatch(addDefaultBook({id:1, book: currentbook }))
      let pos = await bookshelves.findIndex(n=>n.id==shelf)
      dispatch(addbook({book: currentbook, pos}))
      message.success({content: `The book have been added.`, style:{marginTop:"90vh"}})
    }else{
      showerror()
    }
    // dispatch(setcurrentshelf({shelf: bookshelves[currentshelf.pos], pos: currentshelf.pos}))
    dispatch(bclose())
    dispatch(srclose())
    dispatch(nbclose())
  }

  const move = async ()=>{
    const status = await moveBook(currentshelf.id,shelf,currentbook.id,userData.token)
    // console.log(status);
    if(status<300){
      //add
      if(shelf==3) dispatch(addDefaultBook({id:0, book: currentbook }))
      else if(shelf==2) dispatch(addDefaultBook({id:1, book: currentbook }))
      let pos = await bookshelves.findIndex(n=>n.id==shelf)
      if(bookshelves[pos].books && bookshelves[pos].books.load) dispatch(addbook({book: currentbook, pos}))
      //remove
      if(currentshelf.id==3) dispatch(deleteDefaultBook({pos:0, id: currentbook.id }))
      else if(currentshelf.id==2) dispatch(deleteDefaultBook({pos:1, id: currentbook.id }))
      dispatch(deletebook({id: currentbook.id, pos: currentshelf.pos}))
      message.success({content: `The book have been moved.`, style:{marginTop:"90vh"}})
    }else{
      showerror()      
    }
    // dispatch(setcurrentshelf({shelf: bookshelves[currentshelf.pos], pos: currentshelf.pos}))
    dispatch(nbclose())
  }

  const clear = async ()=>{
    const status = await clearShelf(shelf, userData.token)
    if(status<300){
      let pos = await bookshelves.findIndex(n=>n.id==shelf)
      dispatch(clearshelf(pos))
      message.success({content: `The bookshelf have been cleared`, style:{marginTop:"90vh"}})
    }else{
      showerror()
    }
    dispatch(sbclose())
  }

  return (
    <div>
      <Dialog open={modal.open} >
        <DialogTitle style={{width:"300px"}} >Choose a bookshelf: </DialogTitle>
        {(modal.type =="Clear")? <DialogContent>Be careful, this operation will sync to your Google book account, and it cannot be undone.</DialogContent>:<></>}
        <DialogContent>
            <FormControl><Select style={{marginBottom:"8px"}} value={shelf} onChange={handleChange}>
                {bookshelves.map((n,i)=><MenuItem key={i} style={{paddingLeft:"10px"}} value={n.id}>{n.title}</MenuItem>)}
            </Select></FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>dispatch(ssclose())} color="primary">Cancel</Button>
          <Button onClick={ async ()=>{
              if(modal.type == 'Add') add()
              if(modal.type == 'Move') move()
              if(modal.type == "Clear") clear()
              dispatch(ssclose())
          }} color="primary" variant="contained">{modal.type}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}