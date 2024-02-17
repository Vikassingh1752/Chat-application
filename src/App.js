import React, { useRef,useState } from 'react';
import './App.css';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCtbzuDsQYVN2479l2QJ13ToAZEqKfn97s",
  authDomain: "chat-room-app-4655a.firebaseapp.com",
  databaseURL: "https://chat-room-app-4655a-default-rtdb.firebaseio.com",
  projectId: "chat-room-app-4655a",
  storageBucket: "chat-room-app-4655a.appspot.com",
  messagingSenderId: "574906802362",
  appId: "1:574906802362:web:854c2f730809c96c74a283",
  measurementId: "G-CH0R9HGTSY"
};
const auth = firebase.auth();
const firestore = firebase.firestore();

const app = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [user] =useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>Hello</h1>
       <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}
function SignIn(){
  const SignInwithGoogle =() =>{
    const Provider = new firebase.auth.GoogleAuthProvider(); 
    auth.SignInwithpopup(Provider);
  }
  return(
    <button onClick={SignInwithGoogle}>Sign in with Google</button>
  )
}
function SignOut () {
  return auth.currentUser && (
    <button onClick={() => auth.SignOut()}>Sign Out</button>
  )
}
function ChatRoom() {
  const dummy = useRef()
  const messageRef = firestore.collection('message');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [message] = useCollectionData(query, {idField: 'id' });
  const [formvalue, setformvalue] = useState(' ');

  const sendmessage =async(e) =>{
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;

    await messageRef.add({
      text:formvalue,
      createdAt: firebase.firestore.Fieldvalue.serverTimestamp(),
      uid,
      photoURL
    })
    setformvalue(' ');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }
  return(
    <>
    <main>
      {message && message.map(msg => <ChatMessage key={msg.Id} message={msg}/>)}
      <div>ref={dummy}</div>
    </main>
    <form onSubmit={sendmessage}>
      <input value={formvalue} onChange={(e) => setformvalue(e.target.value)}/>
      <button type="Submit"></button>
    </form>
  </>
)
}
function ChatMessage (props){
  const {text, uid} =props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
    
      <p>text</p>
    </div>
  )
}

export default App;
