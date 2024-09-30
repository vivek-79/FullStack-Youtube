

import React, { useState } from 'react'
import './Upload.css'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function Upload() {

    const { register, handleSubmit } = useForm()
    const navigate= useNavigate()
    const [err,setErr]=useState('')
    const upload=(data)=>{
        const formData = new FormData()
        formData.append('videoFile',data.video[0])
        formData.append('thumbnail',data.thumbnail[0])
        formData.append('title',data.title)
        formData.append('description',data.description)
        formData.append('isPublished',data.isPublished)

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
          }
        console.log(data)
        axios.post('/v1/videos/',formData,{
            headers:{
            }
        })
        .then((res)=>{
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
                <div className="file">
                    <input type="file" 
                    id='thumbnail'
                    name='thumbnail'
                    required
                    {...register('thumbnail')}
                    />
                    <i className="ri-upload-cloud-line"></i>
                    <label htmlFor="thumbnail">Thumbnail</label>
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

export default Upload