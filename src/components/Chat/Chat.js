import React,{ useState, useEffect} from "react";
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

import './Chat.css';

let socket;

const Chat = ({location}) =>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [panel, setPanel] = useState(false);
    const ENDPOINT = 'https://react-chat-app-ind-chat.herokuapp.com/';

    useEffect(()=>{
        // eslint-disable-next-line no-restricted-globals
       const {name, room} = queryString.parse(location.search);

       socket = io(ENDPOINT);
        setName(name);
        setRoom(room);

        socket.emit('join', {name , room});

        return ()=>{
            socket.emit('disconnect');

            socket.off();
        }

        // eslint-disable-next-line no-restricted-globals
    },[ENDPOINT, location.search]);

    useEffect(()=>{
        socket.on('message', message =>{
            setMessages((messages)=>[...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    },[]);

    const sendMessage=(event) =>{
        event.preventDefault();

        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    };

    const toggleButton= () =>{
      if(!panel) setPanel(true);
      else setPanel(false);
    };


    return(


        <div className="outerContainer">
            <div className="container">
                <button className="onlineset" onClick={toggleButton}>
                    Online
                    {panel ? <TextContainer users={users}/> : null }
                </button>
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>



        </div>
    )
}

export default Chat;
