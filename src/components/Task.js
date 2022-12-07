import React from 'react'
import { FaEdit, FaCheckDouble, FaRegTrashAlt } from 'react-icons/fa'

const Task = ({ setToCompleted, getSingleTask, stt, task, deleteTask }) => {
   const { _id, name, completed } = task
   return (
      <div className={`task ${completed && 'completed'}`}>
         <p>
            <b>{stt} </b>
            {name}
         </p>
         <div className='task-icons'>
            <FaCheckDouble color='green' onClick={() => setToCompleted(task)} />
            <FaEdit color='purple' onClick={() => getSingleTask(task)} />
            <FaRegTrashAlt color='red' onClick={() => deleteTask(_id)} />
         </div>
      </div>
   )
}

export default Task
