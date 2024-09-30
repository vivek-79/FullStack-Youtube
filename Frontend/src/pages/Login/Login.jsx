

import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import './Login.css'
import { logIn } from '../../Store/AuthSlice.js'

function Login() {
    const {register,handleSubmit} = useForm()
    const navigate=useNavigate()
    const dispatch = useDispatch()
    const login=(data)=>{
        axios.post('/v1/users/login',data)
        .then((res)=>{
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
        onSubmit={handleSubmit(login)}
        >
            <div className='form-input'>
                <label htmlFor="email">Email</label>
                <input 
                type="text"
                id='email'
                placeholder='Enter Name'
                required
                autoComplete='email'
                {...register('email')}
                />
            </div>
            <div className='form-input'>
                <label htmlFor="password">Password</label>
                <input 
                type="password"
                id='password'
                placeholder='Enter Password'
                required
                autoComplete='current-password'
                {...register('password')}
                />
            </div>
            <button type='submit'>Login</button>
            <p>Don&apos;t have an account | <Link to='/register'>Signup</Link></p>
        </form>
    </div>
  )
}

export default Login