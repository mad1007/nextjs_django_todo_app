import { BsFillPencilFill, BsTrash, BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";

const Todo = ({todo, selectTodo, deleteTodo}) => {

  return (
    <>
    <div className='card my-2'>
      <div className='card-header'>
        <h3>{todo.title}</h3>
        <small>Created At: {todo.creation_date}</small>
      </div>
      <div className='card-body'>{todo.description}</div>
      <div className='card-footer  bg-light p-3 border-1'>
        <div className='row'>
          <div className='col-sm-12 col-md-4 align-items-center d-flex justify-content-center text-center my-2'>
            <small>Deadline: <strong>{todo?.deadline?.replace("T", " ") || "Anytime"}</strong></small>
          </div>
          <div className='col-sm-12 col-md-4 align-items-center d-flex justify-content-center text-center my-2 '>
            <small className="d-flex align-items-center justify-content-center " >Done: {todo.done ? <BsCheckCircleFill className="text-success mx-2" size={20} /> :<BsXCircleFill className="text-danger mx-2" size={20} />}</small>
          </div>
          <div className='col-sm-12 col-md-4 align-items-center d-flex justify-content-center text-center my-2'>
              <button className='btn btn-info btn-sm text-white' onClick={()=>selectTodo(todo)}><BsFillPencilFill size={15} /></button>
              <button className='btn btn-danger btn-sm mx-2' onClick={()=>deleteTodo(todo)}><BsTrash size={15} /></button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Todo