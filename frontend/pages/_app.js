import { Layout } from '../components/Layout'
import MessagesProvider from '../contexts/MessageContext'
import UserProvider from '../contexts/UserContext'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
  <MessagesProvider>
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  </MessagesProvider>
  )
}

export default MyApp
