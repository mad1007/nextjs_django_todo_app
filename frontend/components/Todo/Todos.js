import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {  fetchWithCreds } from '../../utils/utils'
import { useMessages } from '../../contexts/MessageContext'
import Todo from './Todo'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useUser } from '../../contexts/UserContext'
import { BsPlus } from "react-icons/bs";

const Todos = () => {
  const [todos, setTodos] = useState([])
  const [filterKey, setFilterKey] = useState("1")
  const [selectedTodo, setSelectedTodo] = useState()
  const [showModal, setShowModal] = useState(false)
  const {user} = useUser()
  const {addMessage} = useMessages()
  console.count('user', user)
  const selectTodo = (todo)=>{
    setSelectedTodo(todo)
    setShowModal(true)
  }
  
  const updateOrCreateTodo = async (e)=>{
    console.log(e)
    e.preventDefault()

    const url = process.env.API_URL || 'http://127.0.0.1:8000/api/'
    const response = await fetchWithCreds(`${url}todos/`,"POST", selectedTodo)
    if(!response){
      addMessage({msg:"Error while fetching todos", type:"warning"})
    }else if(response.status != 200  ){
      const errorMsg = await response.json()
      addMessage({msg:JSON.stringify(errorMsg), type:"warning"})
    }else{
      const data = await response.json()
      console.log('new todo', data)
      let newTodos
      if(selectedTodo.id){
        newTodos = todos.map(todo=>{
          if(todo.id == selectedTodo.id){
            return selectedTodo
          }
          return todo
        })
  
      }else{
        newTodos = [data,...todos]
      }
      setTodos(newTodos)
      setShowModal(false)
      addMessage({msg:"Update succeed", type: "success"})
    }
  }

  const deleteTodo = async(currentTodo)=>{
    if(confirm("Do you realy want to delete this todo")){

      const url = process.env.API_URL || 'http://127.0.0.1:8000/api/'
      const response = await fetchWithCreds(`${url}todos/`,"DELETE", {id:currentTodo.id})
      if(!response){
        addMessage({msg:"Error while fetching todos", type:"warning"})
      }else if(response.status != 204){
        const errorMsg = await response.json()
        addMessage({msg:JSON.stringify(errorMsg), type:"warning"})
      }else{
        const newTodos = todos.filter(todo=>currentTodo.id != todo.id)
        setTodos(newTodos)
        addMessage({type: "success", msg: "todo deleted successfully"})
  
      }
    }
  }
  const filterTodos = ()=>{
    if(filterKey === "1"){
      return todos
    }else if(filterKey === "2"){
      return todos.filter(todo=>todo.done)
    }else{
      return todos.filter(todo=>!todo.done)

    }
  }
  useEffect(()=>{
    const getTodos = async ()=>{
      const url = process.env.API_URL || 'http://127.0.0.1:8000/api/'
      const response = await fetchWithCreds(`${url}todos/`,"GET")
      if(!response){
        addMessage({msg:"Error while fetching todos", type:"warning"})
      }else if(response.status != 200  ){
        const errorMsg = await response.json()
        // If not authenticated error message handled by check auth from userContext
        response.status != 401 && addMessage({msg:JSON.stringify(errorMsg), type:"warning"})
      }else{
        const data = await response.json()
        console.log('data', data)
        setTodos(data)
      }
    }
    getTodos()
  },[])
  
  return (
    <>
    <div className='d-flex row'>
      <div className='col-sm-12 col-md-4 text-center' ><h1>Todos List</h1></div>
      <div className='col-sm-12 col-md-4 text-center mb-3' ><small className='text-muted'>You still have {todos.filter(todo=>!todo.done).length} todos to accomplish</small></div>
      <div className='col-sm-12 col-md-4 text-center' >
        <button className='btn btn-dark btn-lg' onClick={(e)=>{setSelectedTodo({done: false, deadline:"", title:"", description:"", user:user?.id});setShowModal(true)}} ><BsPlus size={30} /> TODO</button>
      </div>
    </div>
      <hr/>
      <Form.Select aria-label="Filter Todos" onChange={(e)=>setFilterKey(e.target.value)}  style={{maxWidth:250, marginLeft:"auto"}}>
        <option value="1">All Todos</option>
        <option value="2">Done</option>
        <option value="3">Not Done Yet</option>
        </Form.Select>

      {todos?.length > 0 ? (filterTodos().map(todo=><Todo key={todo.id} selectTodo={selectTodo} deleteTodo={deleteTodo} todo={todo}/>)) : <h4>No todos are available</h4>}

      <Modal show={showModal} onHide={()=>setShowModal(false)}>
      <Form onSubmit={(e)=>updateOrCreateTodo(e)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTodo?.id ? "Update Todo" : "New Todo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group className="mb-3" controlId="todoTitle" >
            <Form.Label>Title</Form.Label>
            <Form.Control required type="text" value={selectedTodo?.title} onChange={(e)=>setSelectedTodo((data)=>({...data, title:e.target.value}))} placeholder="Todo title" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="todoDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control required type="text" value={selectedTodo?.description} onChange={(e)=>setSelectedTodo((data)=>({...data, description:e.target.value}))}  placeholder="Describe your todo" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="todoDeadline">
            <Form.Label>DeadLine</Form.Label>
            <Form.Control type="datetime-local" value={selectedTodo?.deadline} onChange={(e)=>setSelectedTodo((data)=>({...data, deadline:e.target.value}))} placeholder="Enter a deadline" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="todoDone">
            <Form.Check checked={selectedTodo?.done} type="checkbox" onChange={(e)=>setSelectedTodo((data)=>({...data, done:e.target.checked}))} label="Done" />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" type='submit'>
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>

      </Modal>

    </>
  )
}

export default Todos