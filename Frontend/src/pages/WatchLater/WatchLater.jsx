

import React, { useEffect,useState } from 'react'
import './WatchLater.css'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Card } from '../../components'
function WatchLater() {

  const [data,setData] =useState()
  const userId = useSelector((state)=>state.authState.userData?.data?.user._id)
  useEffect(()=>{
    axios.post('/v1/users/get-watch-history',{userId})
    .then((res)=>{
      console.log(res)
      setData(res.data.data[0]?.watchLater)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[userId])

  return (
    <div className='watch-later'>
        <p className='watch-later-head'>Videos Waiting For You :)</p>
        <div className="watchLater-content">
          {data && data.map((item)=>(
            <Card
              key={item._id}
              title={item.title}
              thumbnail={item.thumbnail}
              owner={item.owner.userName}
              avatar={item.owner.avatar}
              views={item.views}
              videoId={item._id}
              later='Remove'
            />
          ))}
        </div>
    </div>
  )
}

export default WatchLater