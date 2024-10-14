

import React, { useEffect, useState } from 'react'
import './Details.css'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
function Details() {

  const [details, setDetails] = useState([])
  const location = useLocation()
  const { videoId } = location.state || {}
  const navigate = useNavigate()

  const[error,setError]=useState('')
  const [title,setTitle] =useState('')
  const [desc,setDesc] =useState('')
  const [tag,setTag] =useState('')
  const [visible,setVisible] =useState('')
  useEffect(() => {
    axios.get(`/v1/videos/get-video-details/${videoId}`)
      .then((res) => {
        setDetails(res.data.data)
        setTitle(res.data.data?.[0]?.title || '')
        setDesc(res.data.data?.[0]?.description || '')
        setTag(res.data.data?.[0]?.tags || '')
        setVisible(res.data.data?.[0]?.isPublished ? 'Public' : 'Private' ||'')
      })
      .catch((err) => {
        console.log(err)
      })
  }, [videoId])
  const handleInput=(e)=>{
    setError('')
   let editing = (e.target.name)
   let value=(e.target.value)
    if(editing=='title'){
      setTitle(value)
    }
    else if(editing=='desc'){
      setDesc(value)
    }
    else if(editing=='tag'){
      setTag(value)
    }
    else if(editing=='visible'){
      setVisible(value)
    }
  }

  const handleSave=()=>{
    const data ={}
    data.title=title
    data.desc=desc
    data.tag=tag
    data.visiblity=visible
    data.videoId=videoId
    axios.post('/v1/videos/edit-details',data)
    .then((res)=>{
      navigate('/Your channel')
    })
    .catch((err)=>{
      setError(err.message)
    })
  }
  return (
    <div className='details'>
      <div className="video-display">
        <img src={details?.[0]?.thumbnail} alt="" />
        <p>Edit <i className="ri-pencil-line"></i></p>
      </div>
      <div className="basic-info">
        <div className="vid-details">
          <p>Likes</p>
          <p>{details?.[2]}</p>
        </div>
        <div className="vid-details">
          <p>Views</p>
          <p>{details?.[0]?.views}</p>
        </div>
        <div className="vid-details">
          <p>Comments</p>
          <p>{details?.[1]?.length}</p>
        </div>
      </div>
      <div className="editable-info">
        <div className="edit-info">
          <p>Title </p>
          <input type="text" 
            name='title'
            onInput={(e)=>handleInput(e)}
            value={title}
          />
        </div>
        <div className="edit-info">
          <p>Description </p>
          <input type="text"
          name='desc'
           onInput={(e)=>handleInput(e)}
           value={desc}//
          />
        </div>
        <div className="edit-info">
          <p>Tags </p>
          <input type="text" 
            name='tag'
             onInput={(e)=>handleInput(e)}
            value={tag}
          />
        </div>
        <div className="edit-info">
          <p>Visible</p>
          <input type="text"
          name='visible'
          placeholder='private/public'
             onInput={(e)=>handleInput(e)}
           value={visible}
          />
        </div>
        <button onClick={handleSave} className='edit-btn'>Save</button>
          <p className='error'>{error}</p>
        <div className="edit-comments">
          <p className="edit-comments-header">Comments</p>
          {details[1] ?
            details[1].map((item) => (
              <div key={item._id} className="each-comnt">
                <div className="comment-user-info">
                  <img src={item.user[0]?.avatar} alt="" />
                  <p>{item.user[0]?.userName}</p>
                </div>
                <p>{item.content}</p>
                <p>...</p>
              </div>
            ))
            : null}
        </div>
      </div>
    </div>
  )
}

export default Details