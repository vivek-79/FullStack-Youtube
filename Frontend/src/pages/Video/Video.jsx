

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Video.css'
import { SideCard } from '../../components'
import { useSelector } from 'react-redux'
import Videoplayer from './Videoplayer'


function Video() {

    const { videoId } = useParams()
    const [data, setData] = useState()
    const userInfo = useSelector((state) => state.authState.userData)
    const userId = userInfo?.data?.user?._id
    const channelName = data?.owner?.userName
    const [more,setMore] =useState(false)
    useEffect(() => {
        axios.get(`/v1/videos/getvideo-detail/${videoId}`)
            .then((res) => {
                setData(res.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [videoId])

    const channelId = data?.owner?._id
    const [subBtn, setSubBtn] = useState(false)
    const [chanelInfo, setChannelInfo] = useState('')
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState('')
    const [subscribeCount, setLSubscribeCount] = useState('')
    const comments=chanelInfo?.comments
    useEffect(() => {
        if (userId && channelName) {
            axios.post('/v1/users/c', { userName: channelName, userId: userId, videoId: videoId })
                .then((res) => {
                    setLikeCount(res.data.data.totalLikes)
                    setLSubscribeCount(res.data.data.subscriberCount)
                    setChannelInfo(res.data.data)
                    setSubBtn(res.data.data.isSubscriber)
                    setLiked(res.data.data.isLiked)
                })
                .catch((error) => {
                    console.log(error)
                })
            
        }

    }, [userId, channelName])

    //subscribe logic

    const subscribe = () => {
        setSubBtn((prev) => !prev)
        subBtn ? setLSubscribeCount((prev) => prev - 1) : setLSubscribeCount((prev) => prev + 1)
        axios.post('/v1/subscription/addSubscribe', { userId: userId, channelId: channelId })
            .then((res) => {
                console.log(res)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //like logic

    const like = () => {
        setLiked((prev) => !prev)
        liked ? setLikeCount((prev) => prev - 1) : setLikeCount((prev) => prev + 1)
        axios.post('/v1/likes/add-like', { videoId: videoId, userId: userId })
            .then((res) => {
                console.log(res)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    
    //comment
    const [comment,setComment]=useState('')
    const handleChange=(e)=>{
        setComment(e.target.value)
    }
    const submit =()=>{
        axios.post ('/v1/comment/add-comment',{content:comment,userId:userId,videoId:videoId})
        .then((res)=>{
            setComment('')
            console.log(res)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleDescription =()=>{

        setMore((prev)=>!prev)
    }
    
    return (
        <div className='video'>
            <div className='video-center'>
                <div className="video-play">
                    <Videoplayer data={data?.videoFile}></Videoplayer>
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
                                    <p>{subscribeCount}</p>
                                    <p>Subscribers</p>
                                </div>
                            </div>
                            <button
                                className={subBtn ? 'subscribed subscribe-btn' : ' subscribe-btn'}
                                onClick={() => subscribe()}>
                                {subBtn ? 'Unsubscribe' : 'Subscribe'}
                            </button>
                        </div>
                        <div className="lower-right">
                            <div className="like-dis">
                                <i onClick={() => like()} className={liked ? "ri-thumb-up-fill" : "ri-thumb-up-line"}></i>
                                <p>{likeCount}</p>
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
                        <div className= {more ?'less':'more'}>
                            <p onClick={handleDescription}>{more ? 'less ^':'more...'}</p>
                        </div>
                    </div>
                    <div className="comment-para">
                        <div className="all-comment">
                            {comments && comments.map((val)=>(
                                <div className='each-comment' key={val._id}>
                                    <p>{val.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="comment-inpt" id='comment-inpt'>
                <input type="text" required value={comment} onChange={handleChange} placeholder='Add Your Comment ...'/>
                    <button type='submit' onClick={submit}>Add</button>
                </div>
            <div className="video-side">
                <SideCard />
            </div>
        </div>
    )
}

export default Video