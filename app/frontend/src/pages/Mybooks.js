import '../App.css';
import {Paper, Button, CssBaseline} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
// import { Button } from 'antd';
import { useState } from 'react';
import Bookdrawer from '../components/Bookdrawer';
import BookshelfPage from '../components/BookshelfPage';
import {useSelector, useDispatch} from 'react-redux';
import {lopen, sopen } from '../actions';

const useStyles = makeStyles((theme) => ({content: {flexGrow: 1,padding: theme.spacing(3),},}));

const Mybooks = () =>{
    const dispatch = useDispatch()
    const logIn = useSelector(state => state.logIn)
    const classes = useStyles();
    return((logIn)?
       <div className="page">
            <div style={{display:"flex"}} >
                <CssBaseline />
                <Bookdrawer />
                <main className={classes.content}>
                    <BookshelfPage />
                </main>
            </div>
       </div>
       :
       <div className="notlogin">
           <p style={{textAlign:"center", color: "#37474F", height: "40px", fontSize:"20px"}}>Log in with your Google account, to explore your personal book tracker!</p>
            <Button style={{color:"rgb(44, 156, 231)"}} onClick={()=>dispatch(lopen())}>Log In</Button>
            <p style={{color:"grey"}}>Doesn't have an account?
            <Button style={{marginLeft:'5px', color:"rgb(44, 156, 231)"}} onClick={()=>dispatch(sopen())}>Sign Up</Button>
            </p>
       </div>
    )
}

export default Mybooks;
