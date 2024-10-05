

import React from 'react'
import './Card.css'
import { useNavigate } from 'react-router-dom'
function Card(
    {
    title='Chai aur Java',
    thumbnail='https://imgs.search.brave.com/UbGylK2_GHgFXdIGdiiQQLg6g92Ds_DJfpr96_kpMGg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1wc2Qv/eW91dHViZS10aHVt/Ym5haWwtdGVtcGxh/dGUtZGVzaWduLXlv/dXR1YmUtdGh1bWJu/YWlsXzk0MTgwMi0y/Njg4LmpwZz9zaXpl/PTYyNiZleHQ9anBn',
    views=0,
    owner='Chai',
    video,
    videoId,
    avatar=''
    }
)
{
  const navigate =useNavigate()
  return (
    <div className='card'>
        <div onClick={()=>navigate(`/videos/${videoId}`)} className='card-upper'>
        <video className='video' controls src={video}></video>
            <img src={thumbnail} alt="" />
        </div>
        <div className="card-lower">
            <div className="card-avatar">
              <img className='thumbnail' src={avatar} alt="" />
            </div>
            <p className='card-title'>{title}</p>
            <p className='card-channel'>{owner}</p>
            <p className='card-info'>{views} Views</p>
        </div>
    </div>
  )
}

export default Card