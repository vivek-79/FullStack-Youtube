

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
    const [showInput,setShowInput] =useState('')
    useEffect(() => {
        axios.post('/v1/users/get-channel-analysis', { userId })
            .then((res) => {
                setChannelInfo(res.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [user]);
    const channelVideos = channelInfo?.totalVideos?.[0]?.videos
    const channelShorts = channelInfo?.totalShorts?.[0]?.short
    const handleDefaultComp = (data) => {
        setDefaultComp(data)
    }

    const handleImage = (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        console.log(name)
        const formData = new FormData()
        let url;
        if (name == 'avatar') {
            url = '/v1/users/update-avatar'
            formData.append('avatar', file)
        }
        else if (name == 'coverImg') {
            url = '/v1/users/update-coverImage'
            formData.append('coverImage', file)
        }
        if (avatar) {

            axios.post(url, formData)
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const [initialName,setInitialName]=useState()
    useEffect(() => {
        if (showInput) {
            if (showInput === 'userName') {
                setInitialName(user?.userName);
            } else if (showInput === 'fullName') {
                setInitialName(user?.fullName);
            }
        }
    }, [showInput, user]);

    const handleChange =(e)=>{
        setInitialName(e.target.value)
    }
    const handleSubmit = (e) => {
        let file;
        if(showInput==='userName'){
            file ={userName:initialName}
        }
        else{
            file={fullName:initialName}
        }
        axios.post('/v1/users/edit-details',file)
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    return (

        <div className='channel'>
            <div className="channel-personal-info">
                <div className="cover-image">
                    <img src={user?.coverImage} alt="coverImage" />
                    <label htmlFor='coverImg'>Edit</label>
                    <input onChange={(e) => handleImage(e)} type="file" name='coverImg' id='coverImg' />
                </div>
                <div className="other-details">
                    <div className="avatar">
                        <img src={user?.avatar} alt="user-avatar" />
                        <label htmlFor='avatar'>Edit</label>
                        <input onChange={(e) => handleImage(e)} type="file" name='avatar' id='avatar' />
                    </div>
                    <div className="stats-info">
                        <div className="user-names">
                            <div className="initial-names">
                                <p>{user?.fullName.toUpperCase()}<i onClick={()=>setShowInput('fullName')} className="ri-edit-line edit-name"></i></p>
                                <p>@{user?.userName}<i onClick={()=>setShowInput('userName')} className="ri-edit-line edit-name"></i></p>
                            </div>
                            {showInput && <div className="edit-name-input">
                                <input type="text"
                                 onChange={(e)=>handleChange(e)}
                                 value={initialName}
                                />
                                <button onClick={handleSubmit}>ADD</button>
                                <button onClick={()=>setShowInput('')}>X</button>
                            </div>}
                        </div>

                        <div className="other-channel-info">
                            <p id='channel-subs'>Subcribers {channelInfo.totalSubscribers}</p>
                            <div id="other-channel-info2">
                                <div className='other-channel-info-internal'>
                                    <p>Videos</p>
                                    <p>{channelInfo?.totalVideos?.[0]?.totalVideo || 0}</p>
                                </div>
                                <div className='other-channel-info-internal'>
                                    <p>Shorts</p>
                                    <p>{channelInfo?.totalShorts?.[0]?.totalShort || 0}</p>
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
                <p onClick={() => handleDefaultComp(true)} >Videos</p>
                <p onClick={() => handleDefaultComp(false)} >Shorts</p>
            </div>
            <div className='channel-content'>
                {defaultComp ? <div className="channel-content-videos">
                    {channelVideos && channelVideos.map((video) => (
                        <Card
                            key={video._id}
                            title={video.title}
                            views={video.views}
                            thumbnail={video.thumbnail}
                            avatar={user?.avatar}
                            owner={user?.userName}
                            ownerId={userId}
                            videoId={video._id}
                        />
                    ))}
                </div> :
                    <div className="channel-content-videos">
                        {channelShorts && channelShorts.map((short) => (
                            short.owner = user,
                            <ShortDisp data={short} />
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default Channel