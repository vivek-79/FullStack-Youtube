

import React, { useEffect, useState } from 'react'
import './PlayList.css'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { PlaylistCard } from '../../components'

function PlayList() {

    const {register,handleSubmit} =useForm()
    const userId = useSelector((state)=>state.authState.userData?.data?.user._id)
    const [showCreateList,setShowCreateList]=useState(false)
    const [message,setMessage] =useState('')
    const [data,setData] = useState([])

    useEffect(()=>{
        axios.post('/v1/playlist/get-videos',{userId})
        .then((res)=>{
            setData(res.data?.data)
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[userId])
    const handleCreate = (data)=>{
        data.userId = userId
        axios.post('/v1/playlist/create-playList',data)
        .then((res)=>{
            setShowCreateList(false)
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
            setMessage(err.response?.data.message)
        })
    }
    const hanldleCreateListShow =()=>{
        setShowCreateList((prev)=>!prev)
    }
    const handleInput =()=>{
        setMessage('')
    }
    console.log(data)
    return (
        <div className='PlayList'>
            <div className='PlayList-options'>
                <p className='PlayList-title'>PlayList</p>
                <p onClick={hanldleCreateListShow} className='PlayList-title pointer'>Create +</p>
            </div>
           {showCreateList &&  <form
                onSubmit={handleSubmit(handleCreate)}
            >
                <div className="form-input">
                    <label htmlFor="title">Title</label>
                    <input type="text"
                        id='title'
                        placeholder='Enter title'
                        required
                        onInput={handleInput}
                        {...register('title')}
                    />
                    {message && <p>{message}</p> }
                </div>
                <div className="login">
                    <button type='submit'>Save</button>
                </div>
            </form>}
            <div className="PlayList-content">
                {data && data.map((item)=>(
                    <PlaylistCard 
                    key={item._id}
                    playList={item}
                    title={item.name}
                    thummbnail={item.videos?.[0]?.thumbnail}
                    />
                ))}
            </div>
        </div>
    )
}

export default PlayList