import { useRouter } from 'next/router'
import React, { createContext, useContext, useState } from 'react'
import { fetchWithCreds } from '../utils/utils'
import { useMessages } from './MessageContext'
const UserContext = createContext()

const UserProvider = ({children})=>{
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const {addMessage} = useMessages()
    const router = useRouter()

    const checkAuth = async (showMsgError=true)=>{
        setLoading(true)
        const url = process.env.API_URL || 'http://127.0.0.1:8000/api/'
        const response = await fetchWithCreds(`${url}auth/check/`)
        if(!response || response.status != 200){
            if(response){
                const errMessage = await response.json()
                console.log('errMessage', errMessage)
                if(showMsgError){
                    addMessage({type:"warning", msg:errMessage.detail})
                }
            }
            setLoading(false)
            return false
        }
        const data = await response.json()
        setUser(data)
        setLoading(false)
        return true
    }
    const logout = async ()=>{
        const url = process.env.API_URL || 'http://127.0.0.1:8000/api/'
        const response = await fetchWithCreds(`${url}logout/`)
        if(!response || response.status != 200){
            return false
        }
        setUser(undefined)
        router.push('/login')

    }
    return(
        <UserContext.Provider value={{checkAuth, user, loading, setLoading, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider

export const useUser = ()=>{
    const context = useContext(UserContext)
    return context
}