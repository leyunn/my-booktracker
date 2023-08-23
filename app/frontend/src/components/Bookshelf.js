import React from 'react';
import {ListItem, ListItemIcon, ListItemText, Divider,ListSubheader, List} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {useSelector, useDispatch} from 'react-redux';
import { useHistory } from "react-router-dom";
import {setTab, setcurrentshelf} from '../actions';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

export default function Bookshelf() {
  let history = useHistory();
  const dispatch = useDispatch()
  const bookshelves = useSelector(state => state.bookshelves);
  const handleClick = pos =>{
      dispatch(setcurrentshelf({shelf: bookshelves[pos], pos}))
      history.push("/MyBooks");
      dispatch(setTab(2));
  }

  return (
    <div style={{width:"250px"}}>
      <List component="nav" subheader={
        <ListSubheader component="div" style={{textAlign:"left"}}>
          My Books
        </ListSubheader>
      }>
        <ListItem key={-1} button onClick={()=>handleClick(0)} >
          <ListItemIcon>
            <FavoriteIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </ListItem >
        <ListItem key={-2} button onClick={()=>handleClick(3)} >
          <ListItemIcon>
            <CheckIcon color="primary"  />
          </ListItemIcon>
          <ListItemText primary="Have Read" />
        </ListItem>
      <Divider key={-3} />
          {bookshelves.map((n,i) => {
              if(n.id>9 && i < 7){
                  return(
                    <ListItem button key={i} onClick={()=>handleClick(i)} >
                      <ListItemIcon><BookmarkBorderIcon color="primary" /></ListItemIcon>
                      <ListItemText primary={n.title} />
                    </ListItem>
                  )
              }else return <div key={i}></div>
          })}
        </List>
            
        
    </div>
  );
}
