 import {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FavoriteIcon from '@material-ui/icons/Favorite';
import BookIcon from '@material-ui/icons/Book';
import DoneIcon from '@material-ui/icons/Done';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from '@material-ui/core';
import {setcurrentshelf} from '../actions';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {display: 'flex',},
  drawer: {width: drawerWidth,flexShrink: 0,zIndex: 0,},
  drawerPaper: {width: drawerWidth,},
  content: {flexGrow: 1,padding: theme.spacing(3),},
}));




export default function Bookdrawer() {
    const dispatch = useDispatch()
    const bookshelves = useSelector(state => state.bookshelves);
    const currentshelf = useSelector(state => state.currentshelf)
    const [instructionModal, setinstructionModal] = useState(false)
    const classes = useStyles();


  return (
      <>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
        style={{overflowY:"scroll"}}
      >
        <div/>
        <Divider />
        <List>
            <ListItem key={-1}><ListItemText primary={""} /></ListItem>
            <ListItem key={-2}><ListItemText primary={""} /></ListItem> 
            <ListItem button key={0} id={0} onClick={e=>{dispatch(setcurrentshelf({shelf: bookshelves[0], pos: 0}))}} >
              <ListItemIcon><FavoriteIcon color="primary" /> </ListItemIcon>
              <ListItemText style={{color: (currentshelf.id===0)? "rgb(24, 98, 163)":"black"}} primary={`Favorites (${bookshelves[0].volumeCount})`} />
            </ListItem>
            <ListItem button key={3} id={3} onClick={e=>{dispatch(setcurrentshelf({shelf: bookshelves[2], pos: 2}))}} >
              <ListItemIcon><LocalLibraryIcon color="primary" /> </ListItemIcon>
              <ListItemText style={{color: (currentshelf.id===3)? "rgb(24, 98, 163)":"black"}} primary={`Reading Now (${bookshelves[2].volumeCount})`} />
            </ListItem>
            <ListItem button key={2} id={2} onClick={e=>{dispatch(setcurrentshelf({shelf: bookshelves[1], pos: 1}))}} >
              <ListItemIcon><BookIcon color="primary" /> </ListItemIcon>
              <ListItemText style={{color: (currentshelf.id===2)? "rgb(24, 98, 163)":"black"}} primary={`To Read (${bookshelves[1].volumeCount})`} />
            </ListItem>
            <ListItem button key={4} id={4} onClick={e=>{dispatch(setcurrentshelf({shelf: bookshelves[3], pos: 3}))}} >
              <ListItemIcon><DoneIcon color="primary" /> </ListItemIcon>
              <ListItemText style={{color: (currentshelf.id===4)? "rgb(24, 98, 163)":"black"}} primary={`Have Read (${bookshelves[3].volumeCount})`} />
            </ListItem>
        </List>
        <Divider />
        <List>
          {bookshelves.map((n,i) => {
              if(n.id>9){
                  return(
                    <ListItem button key={i} onClick={e=>{dispatch(setcurrentshelf({shelf: bookshelves[i], pos: i}))}} >
                      <ListItemIcon><BookmarkBorderIcon color="primary" /></ListItemIcon>
                      <ListItemText style={{color: (currentshelf.id===n.id)? "rgb(24, 98, 163)":"black"}} primary={`${n.title} (${n.volumeCount})`} />
                    </ListItem>
                  )
              }else return <div key={i}></div>
          })}
          <Divider key={-4} />
          <ListItem key={-3}>
            {/* <Button color="primary" variant="outlined" size="medium" startIcon={<AddIcon />} > Add bookshelf </Button> */}
            <Link onClick={()=>setinstructionModal(!instructionModal)} underline="always" style={{fontSize:"15px"}} >How can I create bookshelf?</Link>
          </ListItem>
          {(instructionModal)? <p key={-5} style={{textAlign:"left", margin:"0px 15px 0px 15px"}}>Unfortunately, Google book doesn't support creating new bookshelf through its API yet. <br/><br/> However, you can create new bookshelf at <a href="https://books.google.com/books" target="_blank" rel="noreferrer" >Google books</a>. </p>:<div key={-5}></div>}
        </List>
      </Drawer>
      </>
  );
}