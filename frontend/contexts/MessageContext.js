import React, { createContext, useContext, useState } from 'react'
const MessagesContext = createContext()

const MessagesProvider = ({children})=>{
    const [messages, setMessages] = useState([])
    
    const appendMessages = (message)=>{
        setMessages([...messages, message])
    }
    const clearMessages = ()=>{
        setMessages([])
    }

    const addMessage = (message)=>{
        setMessages([message])
    }

    console.log(messages)
    return(
        <MessagesContext.Provider value={{messages, appendMessages, clearMessages, addMessage}}>
            {children}
        </MessagesContext.Provider>
    )
}

export default MessagesProvider

export const useMessages = ()=>{
    const context = useContext(MessagesContext)
    return context
}