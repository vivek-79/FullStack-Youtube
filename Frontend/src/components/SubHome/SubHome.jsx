


import React, { useEffect } from 'react'
import './SubHome.css'
import Card from '../Card/Card'

function SubHome({data}) {

    console.log(data)
  return (
    <div className='sub-home'>
        {data && data.map((item)=>(
            <Card
                title={item.title}
                thumbnail={item.thumbnail}
                views={item.views}
                videoId={item._id}
                owner={item.owner?.[0].userName}
                avatar={item.owner?.[0].avatar}
            />
        ))}
    </div>
  )
}

export default SubHome