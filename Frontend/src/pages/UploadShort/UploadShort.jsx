
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

function UploadShort() {

    const userInfo = useSelector((state) => state.authState.userData)
    const userId = userInfo?.data?.user?._id
    const { register, handleSubmit } = useForm()
    const navigate= useNavigate()
    const [err,setErr]=useState('')
    const upload=(data)=>{
        const formData = new FormData()
        formData.append('userId',userId)
        formData.append('short',data.video[0])
        formData.append('title',data.title)
        formData.append('description',data.description)
        formData.append('isPublished',data.isPublished)
//title,description,isPublished,userId
        axios.post('/v1/short/upload',formData)
        .then((res)=>{
            console.log(res)
            navigate('/home')
        })
        .catch((error)=>{
            setErr(error.message)
        });
    }
   return (
    <div className='upload'>
            <form
            onSubmit={handleSubmit(upload)}
            >
                <div className="file">
                    <input type="file" 
                    id='video'
                    name='video'
                    required
                    {...register('video')}
                    />
                    <i className="ri-upload-cloud-line"></i>
                    <label htmlFor="video">Video</label>
                </div>
                <div className="form-input">
                    <label htmlFor="title">Title</label>
                    <input type="text"  
                    placeholder='Enter title' 
                    name='title'
                    id='title'
                    required
                    {...register('title')}
                    />
                </div>
                <div className="form-input">
                    <label htmlFor="description">Description</label>
                    <textarea name="description" 
                    id="description" placeholder='Enter description'
                    required
                    {...register('description')}
                    ></textarea>
                </div>

                <div className="isPublished">
                    <label htmlFor="isPublished">Private</label>
                    <input type="checkbox" 
                    name="isPublished" 
                    id="isPublished"
                    {...register('isPublished')} 
                    />
                </div>
                {err && <p>{err}</p>}
                <button type='submit'>Upload</button>
            </form>
        </div>
    )
}

export default UploadShort