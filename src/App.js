import React, { useEffect, useState } from 'react'
import {
  FormControl,
  Input,
  IconButton,
} from '@material-ui/core'
import './App.css'
import Message from './Message'
import db from './firebase'
import firebase from 'firebase'
import FlipMove from 'react-flip-move'
import SendIcon from '@material-ui/icons/Send'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')

  useEffect(() => {
    //onSnapshot is like snapshot anytime when there is some change in db it will pull all out in variable snapshot below

    //snapshot.map get all docs loop through them and give each document data and it would be object

    //orderby timestamp recent things will come at top

    db.collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() }))
        )
      })
  }, [])

  useEffect(() => {
    setUsername(prompt('Please enter name: '))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sendMessage = (event) => {
    event.preventDefault()

    db.collection('messages').add({
      message: input,
      username: username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setInput('')
  }

  return (
    <div className='App'>
      <img src='https://facebookbrand.com/wp-content/uploads/2019/10/Messenger_Logo_Color_RGB.png?w=100&h=100' />

      <h1>Hello Programmers!!! </h1>
      <form className='app__form'>
        <FormControl className='app__formControl'>
          <Input
            className='app__input'
            placeholder='Enter A message...'
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />

          <IconButton
            className='app__iconButton'
            disabled={!input}
            onClick={sendMessage}
            type='submit'
            color='primary'
            variant='contained'
          >
            <SendIcon />
          </IconButton>

          {/* <Button
            disabled={!input}
            variant='contained'
            color='primary'
            type='submit'
            onClick={sendMessage}
          >
            Send Message
          </Button> */}
        </FormControl>
      </form>

      <FlipMove>
        {messages.map(({ id, message }) => (
          <Message key={id} username={username} message={message} />
        ))}
      </FlipMove>
    </div>
  )
}

export default App
