import React from 'react'

const TaskForm = ({
   updateTask,
   isEditing,
   createTask,
   name,
   handleInputChange
}) => {
   return (
      <form
         onSubmit={isEditing ? updateTask : createTask}
         className='task-form'
      >
         <input
            type='text'
            placeholder='Enter a task'
            value={name}
            name={name}
            onChange={handleInputChange}
         />
         <button type='submit'>{isEditing ? 'Edit' : 'Add'}</button>
      </form>
   )
}

export default TaskForm
