

import React, { useEffect, useState } from 'react'
import './Channel.css'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Card, ShortComp } from '../../components'
import ShortDisp from '../../components/ShortDisp'
const Channel = () => {

    const user = useSelector((state) => state.authState.userData?.data?.user)
    const userId = user?._id
    const [channelInfo, setChannelInfo] = useState({})
    const [defaultComp, setDefaultComp] = useState(true)
    useEffect(() => {
        axios.post('/v1/users/get-channel-analysis', { userId })
            .then((res) => {
                setChannelInfo(res.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [userId]);
    const channelVideos = channelInfo?.totalVideos?.[0].videos
    const channelShorts = channelInfo?.totalShorts?.[0].short
    console.log(channelShorts)
    console.log(channelVideos)
    const handleDefaultComp =(data)=>{
        setDefaultComp(data)
    }
    return (

        <div className='channel'>
            <div className="channel-personal-info">
                <div className="cover-image">
                    <img src="https://imgs.search.brave.com/SFLrjolEm-9ip47KrgHofZDcqzLJq2QFjg6KF7uBLKs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNi8w/Ny8xMC8xNy81NC9r/aWQtMTUwODEyMV82/NDAuanBn" alt="" />
                </div>
                <div className="other-details">
                    <div className="avatar">
                        <img src={user?.avatar} alt="user-avatar" />
                    </div>
                    <div className="stats-info">
                        <p>{user?.fullName.toUpperCase()}</p>
                        <p>@{user?.userName}</p>
                        <div className="other-channel-info">
                            <p id='channel-subs'>Subcribers {channelInfo.totalSubscribers}</p>
                            <div id="other-channel-info2">
                                <div className='other-channel-info-internal'>
                                    <p>Videos</p>
                                    <p>{channelInfo?.totalVideos?.[0].totalVideo || 0}</p>
                                </div>
                                <div className='other-channel-info-internal'>
                                    <p>Shorts</p>
                                    <p>{channelInfo?.totalShorts?.[0].totalShort || 0}</p>
                                </div>
                            </div>

                            <div id="other-channel-info1">
                                <div className='other-channel-info-internal'>
                                    <p id='channel-info-p'>Views</p>
                                    <p>0</p>
                                </div>
                                <div className='other-channel-info-internal'>
                                    <p id='channel-info-p'>Likes</p>
                                    <p>{channelInfo?.totalLike || 0}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="videos-shorts-bar">
                <p onClick={()=>handleDefaultComp(true)} >Videos</p>
                <p onClick={()=>handleDefaultComp(false)} >Shorts</p>
            </div>
            <div className='channel-content'>
                {defaultComp ? <div className="channel-content-videos">
                    {channelVideos && channelVideos.map((video)=>(
                        <Card
                        key={video._id}
                        title={video.title}
                        views={video.views}
                        thumbnail={video.thumbnail}
                        avatar={user?.avatar}
                        owner={user?.userName}
                    />
                    ))}
                </div> :
                    <div className="channel-content-videos">
                        {channelShorts && channelShorts.map((short)=>(
                            short.owner=user,
                        <ShortDisp data={short}/>
                    ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default Channel