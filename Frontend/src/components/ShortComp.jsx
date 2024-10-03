

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { useSelector } from 'react-redux'
import axios from 'axios'

function ShortComp({ data }) {

    const videoRef = useRef(null)
    const userId = useSelector((state) => state.authState.userData?.data?.user._id)
    const [liked, setLiked] = useState(data.isLiked)
    const [showComment, setShowComment] = useState(false)
    const [comment, setComment] = useState('')
    const [allComment, setAllComment] = useState()
    const [shareOption, setShareOption] = useState(false)
    const shortId = data?._id
    useEffect(() => {
        const video = videoRef.current
        let hls
        if (data.short) {
            if (Hls.isSupported()) {
                hls = new Hls({
                    fragLoadingTimeOut: 2000,
                    fragLoadingRetryDelay: 1000
                })
                hls.loadSource(data.short)
                hls.attachMedia(video)
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                })
            }
            else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = data.short;
            }
        }

        //auto-play
        const obserOptions = {
            root: null,
            threshold: 0.6,
        };

        const observeCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    video.play()
                    setPlaying(true)
                }
                else {
                    video.pause()
                }
            })
        };

        const observe = new IntersectionObserver(observeCallback, obserOptions)

        if (video) {
            observe.observe(video)
        }
        return () => {
            if (hls) {
                hls.destroy()
            }
            if (video) {
                observe.unobserve(video)
            }
        }
    }, [data.short])

    const [playing, setPlaying] = useState(true)
    const [mute, setMute] = useState(false)
    const handlePlay = () => {
        if (videoRef.current.paused) {
            setPlaying(true)
            videoRef.current.play()
        }
        else {
            videoRef.current.pause()
            setPlaying(false)
        }
    }
    const handleMute = () => {
        if (mute) {
            setMute(false)
            videoRef.current.volume = 1
        }
        else {
            videoRef.current.volume = 0
            setMute(true)
        }
    }

    //like logic
    const like = ({ userId, shortId }) => {
        setLiked((prev) => !prev)
        axios.post('/v1/likes/add-like/like-short', { shortId, userId })
            .then((res) => {
                console.log(res)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    //comment 
    const handleComment = () => {
        setShowComment((prev) => !prev)
    }

    const handleChange = (e) => {
        setComment(e.target.value)
    }
    const handleSubmit = () => {
        ///add-comment-short
        axios.post('/v1/comment/add-comment-short', { content: comment, shortId, userId })
            .then((res) => {
                setAllComment(res.data.data)
                setComment('')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //fetch-comments
    useEffect(() => {

        if (showComment) {
            axios.post('/v1/comment/get-comment-short', { shortId: shortId })
                .then((res) => {
                    setAllComment(res.data.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [showComment, shortId])

    //share-option
    const copyVisible = () => {
        setShareOption((prev) => !prev)
    }

    //share-logic

    const handleShare=(platform)=>{
        const url = encodeURIComponent(window.location.href)
        const text = encodeURIComponent('Check out this amazing crix')

        let shareUrl ='';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
                break;
            case 'linkdin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${text}%20${url}`
                break;
            case 'copy':
                shareUrl= url
                break;
            default:
                return;
        }
        if(platform==='copy'){
            navigator.clipboard.writeText(shareUrl)
            .then(()=>alert('Link copied to clipboard'))
            .catch((err)=>console.log(err))
        }
        else {
            window.open(shareUrl,'_blank')
        }
    };

    return (
        <div className="short-content">
            <div className="short-video-content">
                <div onClick={handlePlay} className="play-pause-area"></div>
                <video ref={videoRef}></video>
            </div>
            <div className="short-info">
                <div className="user-info">
                    <div className="short-avatar">
                        <img src={data?.owner?.avatar} alt="" />
                    </div>
                    <div className="user-name">
                        <p>{data?.owner?.userName}</p>
                    </div>
                    <button>Subscribe</button>
                </div>
                <div className="short-title">
                    <p>{data?.title}</p>
                </div>
            </div>

            {/*share*/}

            {shareOption &&
                <div className="short-share">
                    <div onClick={()=>handleShare('whatsapp')} className="share-each-option">
                        <img src='\assets\whatsapp_PNG21.png' alt="" />
                        <p>Whatsapp</p>
                    </div>
                    <div onClick={()=>handleShare('facebook')} className="share-each-option">
                        <img src='\assets\facebook.png' alt="" />
                        <p>Facebook</p>
                    </div>
                    <div onClick={()=>handleShare('linkdin')} className="share-each-option">
                        <img src='\assets\linkdin.png' alt="" />
                        <p>Linkdin</p>
                    </div>
                    <div onClick={()=>handleShare('copy')} className="share-each-option">
                        <img src='\assets\copy-url.png' alt="" />
                        <p>Copyurl</p>
                    </div>
                </div>
            }

            {/*comments*/}
            {showComment ? <div className="short-comment">
                <i onClick={handleComment} className="ri-close-circle-line hide-comment"></i>
                {allComment && allComment.map((item) => (
                    <div key={item._id} className="each-short-comment">
                        <img src={item.user.avatar} alt="short-img" />
                        <p className='short-userName'>{item.user.userName}</p>
                        <p>{item.content}</p>
                    </div>
                ))}

            </div> : null}
            <div className="content-comps">
                <i onClick={() => like({ shortId, userId })} className={liked ? "ri-thumb-up-fill" : "ri-thumb-up-line"}></i>
                <i className="ri-thumb-down-line"></i>
                <i onClick={handleComment} className="ri-messenger-line"></i>
                <i onClick={copyVisible} className="ri-share-forward-line"></i>
                <i className="ri-list-check cont-list"></i>
                {playing ? '' : <i className="ri-play-fill" id='short-btn'></i>}
                {<i className={mute ? " ri-volume-mute-line short-mute" : "ri-volume-up-line short-mute"} onClick={handleMute}></i>}

            </div>
            {showComment &&
                <div id="coment-form">
                    <input type="text"
                        onChange={handleChange}
                        value={comment}
                        placeholder='Say something ...' />
                    <button onClick={handleSubmit}>ADD</button>
                </div>
            }
        </div>
    )
}

export default ShortComp