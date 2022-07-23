import React from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup';
import './styles/addToDoComponent.css'
import { addToDoList,fetchToDoList } from './store/features/todoSlice'
import { useSelector, useDispatch } from 'react-redux'

function AddToDoForms(){

const dispatch = useDispatch();


return(
<div className='addToDoContainer' >
<h1> Add ToDos </h1>
<Formik
initialValues={{
    task: '',
    notes: '',
    priority:'',
    completed:false
}}
validationSchema={
    Yup.object({
        task: Yup.string().required("Field cannot be empty"),
        notes: Yup.string(),
        priority: Yup.string(),
        completed: Yup.boolean(),
    })
}
onSubmit={(values)=>{
    console.log(values);
    dispatch(addToDoList({
        label: values.task,
        notes: values.notes,
        priority: values.priority,
        completed: values.completed,
    }
    ))
    dispatch(fetchToDoList())
}}
>
{
({
values,
errors,
touched,
handleChange,
handleBlur,
handleSubmit,
isSubmitting,
}) => (
<div>

<form onSubmit={handleSubmit}>

<label htmlFor='task'>Task: </label>
<input 
type='text'
name='task'
id='task'
onChange={handleChange}
value={values.task}
/>
{errors.task && touched.task ? 
<span>{errors.task}</span>
:null}

<label htmlFor='notes'>Notes: </label>
<textarea 
type='text'
name='notes'
id='notes'
onChange={handleChange}
value={values.notes}
/>
{errors.notes && touched.notes ? 
<span>{errors.notes}</span>
:null}

<label htmlFor='priority'>Priority: </label>
<select 
name='priority'
id='priority'
onChange={handleChange}
value={values.priority}
>
<option value="Low">Low</option>
<option value="Medium">Medium</option>
<option value="High">High</option>
<option value="None">None</option>
</select>

<label htmlFor='completed'>Completed: </label>
<input
type='checkbox'
id='completed'
name='completed'
onChange={handleChange}
value={values.completed}
/>

<button type='submit'>Add</button>
</form>
</div>
)}
</Formik>
</div>
)
};

export default AddToDoForms;