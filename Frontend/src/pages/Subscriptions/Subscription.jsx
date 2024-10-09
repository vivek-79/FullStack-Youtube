

import React, { useEffect, useState } from 'react'
import './Subscription.css'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { SubHome } from '../../components'

function Subscription() {


    const userId = useSelector((state)=>state.authState.userData?.data.user._id)
    const [ownerId,setOwnerId]=useState(0)
    const [channels,setChannels]=useState([])
    const [channelVideos,setChannelVideos]=useState([])
    useEffect(()=>{
        axios.post('/v1/users/get-Subscription',{userId})
        .then((res)=>{
            console.log(res)
            setChannels(res?.data.data)
            setOwnerId(res?.data.data[0]?.channel[0]._id)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[userId])


    useEffect(()=>{
        const handleClick =()=>{

            if(ownerId){
                axios.post('/v1/users/get-channel-video',{ownerId})
                .then((res)=>{
                    setChannelVideos(res.data.data)
                })
                .catch((err)=>{
                    console.log(err)
                })
            }
        }
        handleClick()
    },[ownerId])
   
    console.log(channelVideos)
  return (
    <div className='subscriptions'>
        <div className="profile">
            {channels && channels.map((item)=>(
                <div key={item._id} onClick={()=>setOwnerId(item?.channel[0])} className="each-subs-channel">
                <img src={item?.channel[0]?.avatar} alt="channel-pic" />
                <p>{item?.channel[0]?.userName}</p>
            </div>
            ))}
        </div>
        {channelVideos && <SubHome data={channelVideos}/>}
    </div>
  )
}

export default Subscription