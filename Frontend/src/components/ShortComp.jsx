

import React, { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

function ShortComp({ data }) {

    console.log(data)
    const videoRef = useRef(null)

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
    const [liked, setLiked] = useState(false)
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
    return (
        <div onClick={handlePlay} className="short-content">
            <div className="short-video-content">
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
            <div className="content-comps">
                <i onClick={() => like()} className={liked ? "ri-thumb-up-fill" : "ri-thumb-up-line"}></i>
                <i className="ri-thumb-down-line"></i>
                <i className="ri-messenger-line"></i>
                <i className="ri-share-forward-line"></i>
                <i className="ri-list-check cont-list"></i>
                {playing ? '' : <i className="ri-play-fill" id='short-btn'></i>}
                {<i className={mute ? " ri-volume-mute-line short-mute" : "ri-volume-up-line short-mute"} onClick={handleMute}></i>}

            </div>
        </div>
    )
}

export default ShortComp