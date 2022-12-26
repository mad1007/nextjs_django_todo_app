import React, { useEffect, useState } from 'react'
import styles from '../styles/Login.module.css'
import { fetchWithCreds } from '../utils/utils'
import { useRouter } from 'next/router'
import { useUser } from '../contexts/UserContext'
import { useMessages } from '../contexts/MessageContext'
import Spinner from 'react-bootstrap/Spinner';

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()


    const {checkAuth, loading} = useUser()
    const {addMessage} = useMessages()

    useEffect(() => {
    const authenticate = async ()=>{
          const auth = await checkAuth(false)
          if(auth){
            addMessage({type:'success', msg:'Already logged In'})
            router.push('/')
        }
      }
      authenticate()
  
    }, [])

    if(loading || loading === undefined) return (
    <div className='w-100 m-auto text-center mt-5'>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
    </div>
      )
    
    async function submitLoginForm(e){
        e.preventDefault()
        const body = {username, password}
        const response = await fetchWithCreds(`/api/login/`, 'POST', body)
        if(!response) return
        console.log(response.headers)

        if(response.status != 200){
            const error = await response.json()
            addMessage({'type':'warning', msg:JSON.stringify(error)})
        }else{
            addMessage({type:'success', msg:'Successfully logged In'})
            router.push('/')
        }
    }

  return (
    <div className={`${styles.body} mt-5`}>
        <div className={`${styles.loginContainer} w-100 m-auto text-center`}>
            <form onSubmit={e=>submitLoginForm(e)}>
                <img alt='bootstrap-img' className="mb-4" src="https://getbootstrap.com/docs/5.2/assets/brand/bootstrap-logo.svg"  width="72" height="57"/>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                <div className="form-floating">
                <input value={username} onChange={(e)=>setUsername(e.target.value)} required type="text" className="form-control my-2" id="floatingInput" placeholder="your username"/>
                <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating">
                <input value={password} onChange={(e)=>setPassword(e.target.value)} required type="password"  className="form-control my-2" id="floatingPassword" placeholder="Password"/>
                <label htmlFor="floatingPassword">Password</label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            </form>
        </div>
    </div>
  )
}

export default Login