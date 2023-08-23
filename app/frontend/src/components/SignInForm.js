import ColorTheme from '../ColorTheme';
import { ThemeProvider } from '@material-ui/styles';
import {DialogTitle, Dialog, Button,  DialogContent, CircularProgress, TextField, FormControl} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {Result} from 'antd';
import { useState } from 'react';
import GoogleLogin from 'react-google-login';
import useDB from '../hooks/useDB';
import {useSelector, useDispatch} from 'react-redux';
import {lopen, sclose} from '../actions';



const SignInForm = ()=>{
  const dispatch = useDispatch()
  const signUpModal = useSelector(state => state.signUpModal)
  const handleClose = () => {dispatch(sclose())};
  const [load, setload] = useState(false);
  const [name, setname] = useState('');



  // sing up
  const {signupDB} = useDB();
  const [result, setresult] = useState({state:"waiting", data:{}});
  const suscess = async (res)=>{
    setname(res.profileObj.name);
    setresult({state:"name", data:{mail: res.profileObj.email}})
  }
  const fail = (res)=>{setresult({state:"waiting", data:{error:res.error}})}

    return(
        <ThemeProvider theme={ColorTheme}>
        <div>
      <Dialog open={signUpModal} onClose={handleClose} >
        <DialogTitle id="form-dialog-title" style={{textAlign:"center", padding:"20px"}}>Sign Up</DialogTitle>
        {/* {(!ok)?
        <DialogContent >
            <FormControl>
            <TextField
            style={{height:"70px", width:"300px", padding:"20px"}}
            autoFocus
            type="email"
            placeholder="email"
          />
          <TextField
            type="password"
            style={{height:"70px", width:"300px", padding:"20px"}}
            placeholder="password"
          />
          <Button onClick={()=>{
              setload(true)
              setTimeout(() => {
                setok(true)
              }, 2000);
            }} style={{marginTop:"40px", marginBottom:"30px",color:"#FFFFFF", backgroundColor:"rgb(44, 156, 231)"}}>{(load)?<CircularProgress color="secondary" size={20}/> :"Sign Up"}</Button>
            </FormControl>
            </DialogContent>:
            <>
          <DialogContent>
            <Result status="success"
              title="You have signed up an account."
              subTitle="You can try to log in now."></Result>
          </DialogContent><DialogActions><Button onClick={handleClose} >Ok</Button></DialogActions></>} */}
          <DialogContent >
            {(result.state=="waiting")?
            <div style={{height:"150px", width:"260px"}} >
              <div style={{height:"30px"}} ></div>
              <div style={{marginBottom:"50px"}} >
              <GoogleLogin 
                className="googlelogin"
                clientId="718102756088-h4uacaq2f52dma502uobr6jal9vlekqn.apps.googleusercontent.com"
                buttonText="  Sign up with a google account  "
                theme="dark"
                // render= {renderprop=>
                //   <Button onClick={()=>{
                //   }} style={{marginTop:"40px", marginBottom:"30px",color:"#FFFFFF", backgroundColor:"rgb(44, 156, 231)"}}>Sign up</Button>
                // }
                // onClick={()=>{setresult({state:"loading", data:{}})}}
                onSuccess={suscess}
                onFailure={fail}
                onRequest={()=>{setresult({state:"loading", data:{}})}}
                cookiePolicy={'single_host_origin'}
              />
              {result.data.error? <div style={{margin:"10px", height:"15px"}}><Alert severity="error">{result.data.error}</Alert></div>:<></>}
              </div>
            </div>:
            <div style={{height:"350px", width:"310px", overflowY:"hidden"}} >
              {(result.state!="loading")? (result.state=="fail")? <Result
                status={(result.data.status!=404)? "error":"info"} title={result.data.error}
                subTitle={(result.data.status==404)? `Try to log in with it.`: "Refresh the page or Try again later"}
                extra={[
                  <Button onClick={()=>{
                    handleClose();
                    dispatch(lopen())
                    }} style={{marginLeft:'5px', color:"rgb(44, 156, 231)"}}>Log in</Button>
                ]}
              />:(result.state=="name")?
              <FormControl>
                {/* <p style={{textAlign:"center", marginTop:"40px", fontSize:"14px"}}>Enter your name: </p> */}
                <TextField
                  onChange={inp=>{
                    if(inp.target.value.length>30) return;
                    setname(inp.target.value);
                  }}
                  value={name}
                  style={{height:"70px", width:"300px", padding:"20px", marginTop:"50px"}}
                  placeholder="name"
                  helperText="enter your name (max length: 30)"
                />
                <Button disabled={name===''} onClick={ async ()=>{
                    setload(true);
                    const {status, data} = await signupDB({mail: result.data.mail, name:name})
                    if(status==200){setTimeout(() => {handleClose();}, 4000);
                    setload(false);
                    setresult({state:"sucess", data:{}})
                    }else setresult({state:"fail", data:{status ,error: data.data}})
                }} style={{marginTop:"40px", marginBottom:"30px",color:"#FFFFFF",opacity:(name=='')? "0.7":"1" , backgroundColor:"rgb(44, 156, 231)"}}>{(load)?<CircularProgress color="secondary" size={20}/> :"Sign Up"}</Button>
              </FormControl>
              :<Result status="success"
              title="You have signed up an account."
              subTitle="You can try to log in now."></Result>
              :<div style={{marginLeft:"120px", marginTop:"100px"}} >
                <CircularProgress />
              </div> }
              </div>}
        </DialogContent>
      </Dialog>
    </div>
    </ThemeProvider>
    )
}

export default SignInForm;