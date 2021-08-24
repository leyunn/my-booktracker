import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useSelector, useDispatch} from 'react-redux';
import {cclose,  setTab, deletebook, deleteDefaultBook, nbclose, sethomebook, savereview, reclose, deletenote, neclose, cleardata, sbclose, logout} from '../actions';
import {message} from 'antd';
import { useHistory } from "react-router-dom";
import useApi from '../hooks/useApi';
import useDB from '../hooks/useDB';
import { GoogleLogout } from 'react-google-login';

export default function ConfirmBox() {
  const dispatch = useDispatch();
  const {removeBook} = useApi();
  const confirmModal = useSelector(state => state.confirmModal)
  const currentshelf = useSelector(state=> state.currentshelf)
  const currentbook = useSelector(state => state.currentBook)
  const noteEditorModal = useSelector(state => state.noteeditorModal)
  const userData = useSelector(state => state.userData)
  let history = useHistory();
  const {deletereviewDB, cleardataDB} = useDB();

  const remove = async ()=>{
    // console.log("remove", currentbook,"from", currentshelf.id)
    if(currentshelf.pos===-1){ //homebook remove
      dispatch(sethomebook({id:null}))
      message.success({content: `You have stop reading it.`, style:{marginTop:"90vh"}})
      
    }else{
      const status = await removeBook(currentshelf.id, currentbook.id,userData.token)
    if(status<300){
      //remove
      if(currentshelf.id===3) dispatch(deleteDefaultBook({pos:0, id: currentbook.id }))
      else if(currentshelf.id===2) dispatch(deleteDefaultBook({pos:1, id: currentbook.id }))
      dispatch(deletebook({id: currentbook.id, pos: currentshelf.pos}))

      message.success({content: `The book have been deleted`, style:{marginTop:"90vh"}})
    }else{
      message.error({content: `failed to delete, try again`, style:{marginTop:"90vh"}})
    }
    }
    dispatch(nbclose())
  }

  const deleteReview = async ()=>{
    const {status} = await deletereviewDB({id: currentbook.id, mail: userData.mail})
    if(status===200){
      dispatch(savereview({id: currentbook.id, review: null}))
      dispatch(cclose("review deleted"))
      dispatch(reclose())
    }
  }

  const deleteNote = async ()=>{
    dispatch(deletenote({id: currentbook.id, notepos: noteEditorModal.notepos}))
    dispatch(neclose(-2))
  }
  

  const handlelogout = ()=>{
    dispatch(logout())
    history.push('/');
    dispatch(setTab(0));
    localStorage.removeItem("user")
    message.success({content: "You have logged out.", style:{marginTop:"90vh"}})
    dispatch(cclose())      
  }



  const clearAlldata = ()=>{
    const clear = async () =>{
    const {status} = await cleardataDB({mail: userData.mail})
    dispatch(sbclose(1))
    if(status<300){
      dispatch(cleardata())
      message.success({content:"All the notes/reviews have been clear." ,style:{marginTop:"90vh"}})
    }else{
      message.error({content:"Clear data failed" ,style:{marginTop:"90vh"}})
    }
    }
    clear()
    
  }


  return (
    <div>
      <Dialog open={confirmModal.open} >
        <DialogTitle >Are you sure you want to {confirmModal.title}?</DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={()=>dispatch(cclose())} color="primary">No</Button>
          {(confirmModal.title!=="log out")? <Button onClick={()=>{
            switch(confirmModal.title){
              case  'delete it':
                remove()
                break;
              case 'delete this review':
                deleteReview()
                break;
              case 'delete this note':
                deleteNote()
                break;
              case 'clear all data (notes/reviews)':
                clearAlldata()
                break;
              default:
                break;
            }
              dispatch(cclose())
          }} style={{color:"rgb(156, 50, 50)"}} autoFocus>Yes</Button>:
          <GoogleLogout
            // clientId="718102756088-h4uacaq2f52dma502uobr6jal9vlekqn.apps.googleusercontent.com"
            clientId="718102756088-ll70ob41ab243vlqqd9f86drvp9ms6rt.apps.googleusercontent.com"
            render={renderProps => (
              <Button style={{color:"rgb(156, 50, 50)"}} disabled={renderProps.disabled} onClick={renderProps.onClick} >Log out</Button>
            )}
            onLogoutSuccess={handlelogout}
            onFailure={()=>{
              message.error({content: "log in failed." ,style:{marginTop:"90vh"}})
              dispatch(cclose())
            }}
          />
          }
        </DialogActions>
      </Dialog>
      
    </div>
  );
}