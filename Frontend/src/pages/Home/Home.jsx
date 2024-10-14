

import React, { useEffect, useState } from 'react'
import { Card } from '../../components'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import axios from 'axios'

function Home() {
  const [data,setData] = useState([])

  useEffect(()=>{
    axios.post('/v1/videos/getvideo?page=1&limit=10')
    .then(res => {
      const result=res.data.data.video;
        setData(result)
    })
    .catch(err => {
      console.error(err.message);
    });
  },[]);
  return (
    <div className='space-nav'>
        <div className='home'>
        <div className='main'>
          <div>
            <Navbar/>
          </div>
          <div className='home-content'>
            {data.map((data)=>(
              <Card
              key={data._id}
              thumbnail={data.thumbnail}
              title={data.title}
              views={data.views}
              video={data.videoFile}
              videoId={data._id}
              owner={data.owner.userName}
              avatar={data.owner.avatar}
            />
            ))}
          </div>  
        </div>
    </div>
    </div>
  )
}

export default Home