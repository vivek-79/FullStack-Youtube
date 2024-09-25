import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'

function App() {
  
  const [inpt,setInpt] =useState('')
  useEffect(()=>{
    axios.get('/api/login')
    .then((res)=>{
      setInpt(res.data)
    })
  })   
  return (
    <>
     <h1>{inpt}</h1>
    </>
  )
}

export default App
