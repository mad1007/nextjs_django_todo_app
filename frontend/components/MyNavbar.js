import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useUser } from '../contexts/UserContext';


function MyNavbar() {
  const {user, logout} = useUser()
  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="#home">TODO APP</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {user ? (
            <>
            <Navbar.Text>
            Signed in as: {user?.username}
          </Navbar.Text>
          <button className='btn btn-sm btn-outline-dark mx-2' onClick={(e)=>logout()} >Signout</button>
          </>
          ):""}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;