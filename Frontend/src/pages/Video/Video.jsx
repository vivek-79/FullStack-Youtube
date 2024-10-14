

import React, { useEffect, useState, useRef } from 'react'
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
    const [more, setMore] = useState(false)
    const [recomended, setRecomended] = useState('')
    const [allComment, setAllComment] = useState([])
    const playerRef = useRef(null)
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

        //get-recomendation
        axios.post('/v1/videos/getrecomendations', { videoId })
            .then(res => {
                setRecomended(res?.data?.data)
            })
            .catch(err => {
                console.error(err.message);
            });

        //add-to-watchHistory
        axios.post('/v1/users/add-history', { userId, videoId })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })

        //comments 
        const initialComment = () => {
            axios.post('/v1/comment/get-comment', { videoId })
                .then((res) => {
                    setAllComment(res.data.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        initialComment()
    }, [userId, channelName, videoId])

    //subscribe logic
    const ownerId = chanelInfo._id
    const subscribe = () => {
        setSubBtn((prev) => !prev)
        subBtn ? setLSubscribeCount((prev) => prev - 1) : setLSubscribeCount((prev) => prev + 1)
        axios.post('/v1/subscription/addSubscribe', { userId, channelId, ownerId })
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
        axios.post('/v1/likes/add-like', { videoId, userId, ownerId })
            .then((res) => {
                console.log(res)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //comment

    const [comment, setComment] = useState('')
    const handleChange = (e) => {
        setComment(e.target.value)
    }
    const submit = () => {
        axios.post('/v1/comment/add-comment', { content: comment, userId, videoId })
            .then((res) => {
                setComment('')
                setAllComment(res.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const handleDescription = () => {

        setMore((prev) => !prev)
    }
    return (
        <div className='video' id='video'>
            <div className='video-center'>
                <div className="video-play">
                    <Videoplayer ref={playerRef} data={data?.videoFile}></Videoplayer>
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
                    <div className="comments">
                        <div className="description">
                            <div className='desc-message'>
                                <p>{data?.description}</p>
                            </div>
                            <div className={more ? 'less' : 'more'}>
                                <p onClick={handleDescription}>{more ? 'less ^' : 'more...'}</p>
                            </div>
                        </div>
                        <div className="comment-para">
                            <div className="comment-inpt-small" >
                                <input type="text" required value={comment} onChange={handleChange} placeholder='Add Your Comment ...' />
                                <button type='submit' onClick={submit}>Add</button>
                            </div>
                            <div className="all-comment">
                                {allComment && allComment.map((val) => (
                                    <div className='each-comment' key={val._id}>
                                        <img src={val.user.avatar} alt="user-pic" />
                                        <p>{val.user.userName}</p>
                                        <p>{val.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="video-side">
                {recomended && recomended.map((item) => (
                    <SideCard key={item._id} data={item} />

                ))}
            </div>
        </div>
    )
}

export default Video