

import React from 'react'
import './Details.css'
import { useLocation } from 'react-router-dom'
function Details() {

    const location = useLocation()
    const {videoId} = location.state || {}
    console.log(videoId)
  return (
    <div className='details'>
        <div className="video-display"></div>
        <div className="basic-info">
            
        </div>
    </div>
  )
}

export default Details