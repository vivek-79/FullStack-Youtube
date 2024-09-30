

import React from 'react'
import { useForm } from 'react-hook-form'
import { logIn } from '../../Store/AuthSlice.js'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import './register.css'
import axios from 'axios'

function Register() {
  const {register,handleSubmit} = useForm()
    const navigate=useNavigate()
    const dispatch = useDispatch()
    const signup=(data)=>{
      console.log(data)
      const formData= new FormData()
      formData.append('fullName',data.fullName);
      formData.append('userName',data.userName);
      formData.append('email',data.email);
      formData.append('password',data.password);
      formData.append('avatar',data.avatar[0])

        axios.post('/v1/users/register',formData,{
          headers:{
            'Content-Type':'multipart/form-data'
          }
        })
        .then((res)=>{
            console.log(res)
            dispatch(logIn(res.data))
            navigate('/home')
        })
        .catch((error)=>{
            console.log(error.message)
        })
    }
  return (
    <div className='login'>
        <form
        onSubmit={handleSubmit(signup)}
        >
            <div className='form-input'>
                <label htmlFor="fullNAme">Full Name</label>
                <input 
                type="text"
                id='fullName'
                placeholder='Enter Full Name'
                required
                autoComplete='fullName'
                {...register('fullName')}
                />
            </div>
            <div className='form-input'>
                <label htmlFor="userName">User Name</label>
                <input 
                type="text"
                id='userName'
                placeholder='Enter User Name'
                required
                autoComplete='userName'
                {...register('userName')}
                />
            </div>
            <div className='form-input'>
                <label htmlFor="email">Email</label>
                <input 
                type="email"
                id='email'
                placeholder='Enter Email'
                required
                autoComplete='email'
                {...register('email')}
                />
            </div>
            <div className='form-inp'>
                <label htmlFor="avatar">Image</label>
                <input 
                type="file"
                id='avatar'
                name='avatar'
                required
                autoComplete='image'
                {...register('avatar')}
                />
            </div>
            <div className='form-input'>
                <label htmlFor="password">Password</label>
                <input 
                type="password"
                id='password'
                placeholder='Enter Password'
                required
                autoComplete='currentPassword'
                {...register('password')}
                />
            </div>
            <button type='submit'>Signup</button>
            <p>Already have an account | <Link to='/login'>Login</Link></p>
        </form>
    </div>
  )
}

export default Register