

import React from 'react'
import { useNavigate } from 'react-router-dom'
function PlaylistCard(
    {
        playList ,
        title='PlayList',
        thummbnail='https://imgs.search.brave.com/Jw5U-GC3CO6XsouhDnIbVXpQgoCIP7a-jMXKw4G0-so/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNi8w/Ni8wNi8yMS81My9j/aGlsZC0xNDQwNTI2/XzY0MC5qcGc'
    }
) {
    const navigate = useNavigate()
  return (
    <div onClick={()=>navigate(`/PlaylistPlay/${playList._id}`,{state:{playList}})} className='playListCard'>
        <img src={thummbnail} alt="playList Image" />
        <p>{title}<i className="ri-play-circle-line"></i></p>
    </div>
  )
}

export default PlaylistCard