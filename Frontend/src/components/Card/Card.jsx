

import React, { useEffect, useState } from 'react'
import './Card.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
function Card(
  {
    title = 'Chai aur Java',
    thumbnail = 'https://imgs.search.brave.com/UbGylK2_GHgFXdIGdiiQQLg6g92Ds_DJfpr96_kpMGg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1wc2Qv/eW91dHViZS10aHVt/Ym5haWwtdGVtcGxh/dGUtZGVzaWduLXlv/dXR1YmUtdGh1bWJu/YWlsXzk0MTgwMi0y/Njg4LmpwZz9zaXpl/PTYyNiZleHQ9anBn',
    views = 0,
    owner = 'Chai',
    video,
    videoId,
    avatar = '',
    later = 'Watch later',
    playlist = 'Add to playlist'
  }
) {
  const userId = useSelector((state) => state.authState.userData?.data?.user._id)
  const [option, setOption] = useState(false)
  const [showPlaylists, setShowPlaylists] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const navigate = useNavigate()

  const handleOption = () => {
    setOption((prev) => !prev)
    setShowPlaylists(false)
  }

  const handleSaveWatch = () => {
    axios.post('/v1/users/add-watch-later', { userId, videoId })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    setOption((prev) => !prev)
  }

  const getPlayListOptions = () => {
    axios.get(`v1/playlist/get-playList/${userId}`)
      .then((res) => {
        console.log(res)
        setPlaylists(res.data.data?.playlists)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  ///addTo-playlist

  const handleAdd = (playlistId,videoId) => {
    console.log(playlistId,videoId)
    axios.post('v1/playlist/addTo-playlist',{playlistId,videoId})
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      console.log(err)
    })

  }

  const handleShowPlayListOptions = () => {
    setShowPlaylists((prev) => !prev)
  }
  useEffect(() => {
    if (showPlaylists && userId) {
      getPlayListOptions()
    }
  }, [showPlaylists])

  return (
    <div className='card'>
      <div onClick={() => navigate(`/videos/${videoId}`)} className='card-upper'>
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
        <p onClick={handleOption} className='card-options'>...</p>
      </div>
      {option && <div className="show-option">
        <p onClick={handleSaveWatch}>{later}</p>
        <p onClick={handleShowPlayListOptions}>{playlist}</p>
        {showPlaylists && <div onClick={handleOption} className='user-play-lists'>
          {playlists && playlists.map((item) => (
            <p onClick={() => handleAdd(item._id, videoId)} key={item?._id}>{item.name}</p>
          ))}
        </div>}
      </div>}
    </div>
  )
}

export default Card