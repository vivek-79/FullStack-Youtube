

import React, { useState } from 'react'
import './SideCard.css'
import { useNavigate } from 'react-router-dom'

function SideCard({data}) {
  
  const  [options,setOptions] =useState(false)

  const navigate = useNavigate()

  const handleOptions =()=>{
    setOptions((prev)=>!prev)
  }
  const videoId =data?._id
  return (
    <div className='side-card'onClick={()=>navigate(`/videos/${videoId}`)}>
      <div className="content">
        <img src={data.thumbnail} alt="video-thumbnail" />
      </div>
      <div className="side-card-description">
        <div className='side-card-title'>
          <p>{data.title}</p>
        </div>
        <div className="side-card-owner">
          <img src={data.owner[0]?.avatar} alt="owner-pic" />
          <p>{data.owner[0]?.userName}</p>
        </div>
        <div className="side-card-button">
          <p  onClick={handleOptions} >...</p>
        </div>
        {options && <div className="side-card-options">
          <p>Watch later</p>
          <p>Remove</p>
        </div>}
      </div>
    </div>
  )
}

export default SideCard