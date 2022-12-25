import Alert from 'react-bootstrap/Alert';
import React, { useState } from 'react'
import { useMessages } from '../contexts/MessageContext';
import { toast } from 'react-toastify';

const CustomAlert = ({type, message, timeout}) => {
    const [show, setShow] = useState()
    const {setMessages, messages} = useMessages()
    useState(()=>{
        setShow(true)
        if(timeout){
            setTimeout(()=>{
                setShow(false)
            },timeout)
        }
    },[])
  if(!show) return
return (
  <>{toast(message)}</>
    // <Alert  variant={type} onClose={() => {setShow(false); setMessages(messages.filter(msg=>msg.msg != message))}} dismissible>
    // {message}
    // </Alert>
  )
}

export default CustomAlert