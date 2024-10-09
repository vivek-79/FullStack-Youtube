
import {Header,Footer, Aside} from './components/index'
import { Outlet, useNavigate } from 'react-router-dom'
import { search } from './Store/componentSlice'
import './Layout.css'
import axios from 'axios'

import React, { useEffect } from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import { logIn } from './Store/AuthSlice'

function Layout() {

  const show = useSelector((state)=>state.compSlice.status)
  const searchResult = useSelector((state)=>state.compSlice.data)
  const dispatch=useDispatch()
  const navigate = useNavigate()
  
  const handleClick =(videoId)=>{
    dispatch(search({}))
    navigate(`/videos/${videoId}`)
  }

  useEffect(()=>{
    axios.get('/v1/users/get-user-details')
    .then((res)=>{
      dispatch(logIn(res.data))
      console.log(res)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])
  return (
    <div>
        <Header/>
        <div className='pages'>
        {show && <Aside/>}
        <div className="outlet">
          { searchResult.length>0 && <div className="search-result">
            { searchResult.map((item)=>(
              <p key={item._id} onClick={()=>handleClick(item._id)}><i className="ri-search-line"></i>{item.title.toLowerCase()}</p>
            ))}
          </div>}
        {<Outlet/>}
        </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Layout