import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Task from './Task'
import TaskForm from './TaskForm'
import axios from 'axios'
import { URL } from '../App'
import { get } from 'mongoose'
import loadImage from '../assets/loader.gif'

const TaskList = () => {
   const [formData, setFormData] = useState({
      name: '',
      completed: false
   })
   const [tasks, setTasks] = useState([])
   const [completedTasks, setCompletedTasks] = useState(0)
   const [isLoading, setIsLoading] = useState(false)
   const [isEditing, setIsEditing] = useState(false)
   const [taskID, setTaskID] = useState('')

   const { name } = formData

   const handleInputChange = e => {
      const { value } = e.target
      setFormData({ ...formData, name: value })
   }

   const getAllTasks = async () => {
      setIsLoading(true)
      try {
         const { data } = await axios.get(`${URL}/api/tasks`)
         setTasks(data)
         setIsLoading(false)
      } catch (error) {
         toast.error(error.message)
         console.log(error)
         setIsLoading(false)
      }
   }

   useEffect(() => {
      getAllTasks()
      const cTasks = tasks.filter(task => task.completed === true)

      setCompletedTasks(cTasks)
      return () => {}
   }, [])

   const createTask = async e => {
      e.preventDefault()
      if (!name) {
         return toast.error('Input cannot be empty')
      }
      try {
         const res = await axios.post(`${URL}/api/tasks`, formData)
         if (res.status === 200) {
            toast.success('Task added successfully')
         }
         getAllTasks()
         setFormData({ ...formData, name: '' })
      } catch (error) {
         toast.error(error.message)
      }
   }

   const deleteTask = async id => {
      try {
         await axios.delete(`${URL}/api/tasks/${id}`)
         toast.success('Delete successfully')
         getAllTasks()
      } catch (error) {
         console.log(error)
         toast.error(error.message)
      }
   }

   const getSingleTask = async task => {
      setFormData(prevTask => {
         return { ...prevTask, ...task }
      })
      setTaskID(task._id)
      setIsEditing(true)
   }

   const updateTask = async e => {
      e.preventDefault()
      if (!name) {
         return toast.error('Input cannot be empty')
      }
      //   call api put
      try {
         await axios.put(`${URL}/api/tasks/${taskID}`, formData)
         setFormData({ ...formData, name: '' })
         setIsEditing(false)
         getAllTasks()
      } catch (error) {
         toast.error(error.message)
         console.log(error)
      }
   }

   const setToCompleted = async task => {
      // update db
      try {
         await axios.put(`${URL}/api/tasks/${task._id}`, {
            name: task.name,
            completed: !task.completed
         })
      } catch (error) {
         toast.error('Cannot change')
         console.log(error.message)
      }
      // update UI
      //   getAllTasks()
      setTasks(prevTasks => {
         return prevTasks.map(oldTask => {
            if (oldTask === task) {
               return { ...oldTask, completed: !task.completed }
            }
            return oldTask
         })
      })
   }

   return (
      <div>
         <h2>Task manager</h2>
         <TaskForm
            name={name}
            createTask={createTask}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
            updateTask={updateTask}
         />
         <div className='--flex-between --pb'>
            <p>
               <b>Total tasks: {tasks.length}</b>
            </p>
            <p>
               <b>Completed tasks: {completedTasks.length}</b>
            </p>
         </div>
         <hr />
         {isLoading && (
            <div className='--flex-center'>
               <img src={loadImage} alt='loading' />
            </div>
         )}
         {!isLoading && tasks.length > 0 ? (
            tasks.map((item, idx) => {
               return (
                  <Task
                     key={item._id}
                     task={item}
                     stt={idx + 1}
                     deleteTask={deleteTask}
                     getSingleTask={getSingleTask}
                     setToCompleted={setToCompleted}
                  />
               )
            })
         ) : (
            <p className='--py'>No task added</p>
         )}
      </div>
   )
}

export default TaskList
