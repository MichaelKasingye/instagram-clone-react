import React, {useState, useEffect} from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Post from "./Components/Post";
import {db, auth} from './Firebase/firebase';
import { Button, Input } from '@material-ui/core';
import ImageUpLoad from './Components/ImageUpLoad';
import InstagramEmbed  from 'react-instagram-embed';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const[posts,setPosts] = useState([]);
  const[open, setOpen] = useState(false);
  const[openSignIn, setOpenSignIn] = useState(false);
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const[email, setEmail] = useState('');
const[user,setUser] = useState(null);

useEffect(()=>{
 const unsubscribe =  auth.onAuthStateChanged((authUser)=>{
    if (authUser) {
      //user has logged in
      console.log(authUser);
      setUser(authUser);
    } else {
      //user has logged out
      setUser(null);
    }
  })
  return () =>{
    //user has logged out
    unsubscribe();
  }
},[user, username]); 

//useEffect runs a piece of code after a specific conditition
useEffect(()=>{
 db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
   //it listens for any new post added
   setPosts(snapshot.docs.map(doc => ({
     id:doc.id,
     post:doc.data()
    })));
 })
},[]);

function signUp(event){
event.preventDefault(); 
auth
.createUserWithEmailAndPassword(email,password)
.then((authUser)=>{
  return authUser.user.updateProfile({
    displayName: username
  })
})
.catch((error)=> alert(error.message));
setOpen(false);
}

function signIn(event){
  event.preventDefault();
  auth
  .signInWithEmailAndPassword(email, password)
  .catch((error) => alert(error.message));
  setOpenSignIn(false);
}

  return (
    <div className="app">
      
   <Modal
    // open={()=> setOpen(true)}
    open={open}
    onClose={()=> setOpen(false)}>
   <div style={modalStyle} className={classes.paper}>
     <form className="app_signup">
      <center>
      <img 
        className="app_headerImage"src="https://turbologo.com/articles/wp-content/uploads/2019/09/instagram-logo-illustration-678x381.png.webp"alt=""/>
        </center>
        <Input 
       type="text" placeholder="username"  value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <Input 
        placeholder="email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <Input 
        placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <Button type="submit" onClick={signUp}>Sign Up</Button>  
     </form>
       </div>
      </Modal>

      <Modal
    // open={()=> setOpen(true)}
    open={openSignIn}
    onClose={()=> setOpenSignIn(false)}>
   <div style={modalStyle} className={classes.paper}>
     <form className="app_signup">
      <center>
      <img 
        className="app_headerImage"src="https://turbologo.com/articles/wp-content/uploads/2019/09/instagram-logo-illustration-678x381.png.webp"alt=""/>
        </center>
        <Input 
        placeholder="email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <Input 
        placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <Button type="submit" onClick={signIn}>Sign In</Button>  
     </form>
       </div>
      </Modal>



      <div className="app_header">
        <img 
        className="app_headerImage"src="https://turbologo.com/articles/wp-content/uploads/2019/09/instagram-logo-illustration-678x381.png.webp"alt=""/>

      {user?(
      <Button onClick={()=> auth.signOut()}>LOgout</Button>
      ):(
        <div className="app_loginContainer">
          <Button onClick={()=> setOpenSignIn(true)}>Sign in</Button>
          <Button onClick={()=> setOpen(true)}>Sign up</Button>
        </div>
       )}
      </div>

        <div className="app_post">
        <div className="app_post_left">
      {
        posts.map(({id, post}) =>(
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
        </div>

        <div className="app_post_right">
              <InstagramEmbed
        url='https://instagr.am/p/Zw9o4/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
        </div>
        </div>
      
      {
        // ? - that is called an optional in javascript 
        user?.displayName ? (
          <ImageUpLoad username={user.displayName}/>
        ):(
          <h3>Sorry you need to login to upload</h3>
        )
      }
    </div>
  );
}


export default App;
