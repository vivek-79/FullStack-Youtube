

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Video.css'
import { SideCard } from '../../components'
import { useSelector } from 'react-redux'

function Video() {
    
    const { videoId } = useParams()
    const [data, setData] = useState()
    const userInfo= useSelector((state)=>state.authState.userData)
    const userId=userInfo?.data?.user?._id
    const channelName=data?.owner?.userName
    useEffect(() => {
         axios.get(`/v1/videos/getvideo-detail/${videoId}`)
            .then((res) => {
                setData(res.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
        
    }, [videoId])

    const channelId=data?.owner?._id
    const [subBtn,setSubBtn]= useState(false)
    const [chanelInfo,setChannelInfo] =useState('')
    useEffect(()=>{
        if(userId&& channelName){
            axios.post('/v1/users/c',{userName:channelName,userId:userId})
            .then((res)=>{
               setChannelInfo(res.data.data)
               setSubBtn(res.data.data.isSubscriber)
            })
            .catch((error)=>{
                console.log(error)
            })
        }
    },[userId,channelName])

    const subscribe= ()=>{
        axios.post('/v1/subscription/addSubscribe',{userId:userId,channelId:channelId})
        .then((res)=>{
            console.log(res)
            setSubBtn(true)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    const unSubscribe=()=>{

        axios.post('/v1/subscription/delete-subscriber',{userId:userId,channelId:channelId})
        .then((res)=>{
            console.log(res)
            setSubBtn(false)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    console.log(subBtn)
    return (
        <div className='video'>
            <div className='video-center'>
                <div className="video-play">
                    <video src={data?.videoFile} controls></video>
                </div>
                <div className="comps">
                    <p className='comps-title'>{data?.title}</p>
                    <div className="comp-lower">
                        <div className="lower-left">
                            <div className='avatar'>
                                <img src={data?.owner?.avatar} alt="avatar" />
                            </div>
                            <div className='comps-userName'>
                                <h4>{data?.owner?.userName}</h4>
                                <div className="chanel-subs">
                                    <p>{chanelInfo.subscriberCount}</p>
                                    <p>Subscribers</p>
                                </div>
                            </div>
                            <button 
                            className={subBtn? 'subscribed subscribe-btn':'subscribe-btn'} 
                            onClick={()=>subBtn?unSubscribe():subscribe()}>
                            {subBtn ? 'unSubscribe': 'Subscribe'}
                            </button>
                        </div>
                        <div className="lower-right">
                            <div className="like-dis">
                                <i className="ri-thumb-up-line"></i>
                                <p>400</p>
                                <p>|</p>
                                <i className="ri-thumb-down-line"></i>
                            </div>
                            <div className='like-dis'>
                            <i className="ri-share-forward-line"></i>
                            <p>Share</p>
                            </div>
                            <div className='like-dis downlod-icon'>
                            <i className="ri-download-2-line"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="comments">
                    <div className="description">
                        <div className='desc-message'>
                            <p>{data?.description}</p>
                        </div>
                        <div className='more'>
                            <p>...more</p>
                        </div>
                    </div>
                    <div className="comment-para">
                        <p>hii</p>
                        <p>hii</p>
                        <p>hii</p>
                        <p>hii</p>
                        <p>hii</p>
                    </div>
                </div>
            </div>
            <div className="video-side">
                <SideCard/>
            </div>
        </div>
    )
}

export default Video