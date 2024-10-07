
import {Header,Footer, Aside} from './components/index'
import { Outlet, useNavigate } from 'react-router-dom'
import { search } from './Store/componentSlice'
import './Layout.css'

import React from 'react'
import { useSelector ,useDispatch} from 'react-redux'

function Layout() {
  const show = useSelector((state)=>state.compSlice.status)
  const searchResult = useSelector((state)=>state.compSlice.data)
  const dispatch=useDispatch()
  const navigate = useNavigate()
  
  const handleClick =(videoId)=>{
    dispatch(search({}))
    navigate(`/videos/${videoId}`)
  }
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