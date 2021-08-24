
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, IconButton, DialogContentText, Tooltip} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CloseIcon from '@material-ui/icons/Close';
import {copen, reclose, savereview } from '../actions';
import { Editor } from 'react-draft-wysiwyg';
import {EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useState, useRef, useEffect} from 'react';
import useDB from '../hooks/useDB';
import { message } from 'antd';

const Revieweditor = ({review, setreview})=>{
    const dispatch = useDispatch()
    const modal = useSelector(state => state.revieweditorModal)
    const [editorState, seteditorState] = useState(()=>EditorState.createWithContent(convertFromRaw(JSON.parse("{\"blocks\":[{\"key\":\"c0hh6\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"9h251\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"))))
    const [autofocus, setautofocus] = useState(false)
    const [saved, setsaved] = useState(true)
    const confirmModal = useSelector(state => state.confirmModal)
    const [savedContent, setsavedContent] = useState(null)
    const [deleting, setdeleting] = useState(false)
    const [confirmOpen, setconfirmOpen] = useState(false)
    const book = useSelector(state => state.currentBook)
    const userData = useSelector(state => state.userData)
    const editor = useRef(null);
    const {updatereviewDB} = useDB();

    const focusEditor = ()=>{
        editor.current?.focus();
    }


    useEffect(() => {
        if(modal){
            //open
            let rawcontent = null;
            if(review!==""){
                rawcontent = JSON.parse(review);
                seteditorState(()=>EditorState.createWithContent(convertFromRaw(rawcontent)))
            } else{
                rawcontent = JSON.parse("{\"blocks\":[{\"key\":\"c0hh6\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"9h251\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}")
                seteditorState(()=>EditorState.createWithContent(convertFromRaw(rawcontent)))
            }
            setsavedContent(rawcontent)
            setsaved(true)
            setautofocus(false)
        }
    }, [modal])

    const handleClose = ()=>{
        if(saved){
            dispatch(reclose())
        }else{
            setconfirmOpen(true)
        }
    }

    const handleDelete = ()=>{
        dispatch(copen("delete this review"))
        setdeleting(true)
    }

    useEffect(() => {
        if(deleting && confirmModal.title=="review deleted"){
            setreview("")
            setdeleting(false)
        }
    }, [confirmModal])
    

    const handleSave = async () =>{
        let rawcontent = convertToRaw(editorState.getCurrentContent());
        let content = JSON.stringify(rawcontent)
        setreview(content)
        setsavedContent(rawcontent)
        dispatch(savereview({id: book.id, review: content}))
        const { status} = await updatereviewDB({id:book.id, mail: userData.mail,review:content })
        if(status>=300){
            message.error("review is not saved due to technical issues")
        }else{
            setsaved(true)
        }
        
    }

    const _handlePastedText = (pastedText) => {
        const currentContentLength = editorState.getCurrentContent().getPlainText('').length;
        if (currentContentLength + pastedText.length > 2000) {
          return 'handled';
        }
    }

    const _handleBeforeInput = (i) => {
        const currentContentLength = editorState.getCurrentContent().getPlainText('').length;
        if (currentContentLength > 2000) {   
          return 'handled';
        }

    }

    const handleEditorStateChange = (neweditorState)=>{
        seteditorState(neweditorState)
        let state = editorState.getCurrentContent()
        let newstate = neweditorState.getCurrentContent()
        if(state!= newstate){
            if(JSON.stringify(convertToRaw(newstate))==JSON.stringify(savedContent)){
                setsaved(true)
            } else if(saved) setsaved(false)
        }
    }


    return(
        <div>
        <Dialog open={modal} onClose={handleClose} maxWidth="md" >
            
            <DialogActions style={{paddingBottom:"0px"}}>
                <Tooltip title="delete" >
                    <IconButton onClick={handleDelete} style={{height:"35px", width:"35px",margin:"0px 10px 0px 10px", color:"rgb(156, 50, 50)" }} ><DeleteOutlineIcon/> </IconButton>
                </Tooltip>
                <DialogTitle style={{textAlign:"center", width:"395px"}}>Review Editor</DialogTitle>
                <Button disabled={saved} onClick={handleSave} size="small" color="primary" variant="contained" >Save</Button>
                <Tooltip title="close" >
                    <IconButton onClick={handleClose} style={{height:"35px", width:"35px",margin:"0px 10px 0px 10px" }} ><CloseIcon/></IconButton>
                </Tooltip>
                
            </DialogActions>
            <DialogContent style={{ width:"605px", paddingTop:"0px"}}  >
            <div style={{height:"600px", width:"560px"}} >
            <Editor
                handlePastedText={_handlePastedText}
                handleBeforeInput={_handleBeforeInput}
                editorRef={ref=>{
                    editor.current=ref;
                    if(autofocus==false){
                        focusEditor()
                    }
                }}
                editorState={editorState}
                onFocus={()=>setautofocus(true)}
                toolbar={{
                    options:['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
                    inline:{
                        options: ['bold', 'italic', 'underline'],
                    },
                    textAlign:{
                        options:['left','center', 'right']
                    },
                    blockType: {
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
                    },
                    list: {
                        inDropdown: false,
                        className: undefined,
                        component: undefined,
                        dropdownClassName: undefined,
                        options: ['unordered', 'ordered'],
                      },

                }}
                onEditorStateChange={handleEditorStateChange}
                
            />
            </div>
            </DialogContent>
        </Dialog>
        <Dialog open={confirmOpen} >
        <DialogTitle >Do you want to save the changes you made?</DialogTitle>
        <DialogContent>
            <DialogContentText>
                The changes will be lost if you don't save them.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={()=>{
              setconfirmOpen(false)
              dispatch(reclose())
          }} color="primary" variant="outlined" style={{marginRight:"60px"}} >Don't save</Button>
          <Button size="small" onClick={()=>setconfirmOpen(false)} color="primary" >Cancel</Button>
          <Button size="small" onClick={()=>{
              handleSave()
              setconfirmOpen(false)
              dispatch(reclose())
          }} color="primary" variant="contained" >Save</Button>
        </DialogActions>
      </Dialog>
        </div>
    )
}

export default Revieweditor;