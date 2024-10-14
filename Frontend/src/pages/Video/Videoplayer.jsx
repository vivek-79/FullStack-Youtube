
import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import './Video.css'
import Hls from 'hls.js'

function Videoplayer({ data }) {

    const videoRef = useRef(null)
    const controlRef =useRef(null)

    const [isPlay, setIsPlay] = useState(false)
    const [totalTime, setTotaltime] = useState(`0:00`)
    const [currentTime, setCurrentTime] = useState(`0:00`)
    const [hlsInstance, setHlsInstance] = useState(null);
    const [qualityLevels, setQualityLevels] = useState([]);

    //play-pause
    const handlePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play()
            setIsPlay(true)
        }
        else {
            videoRef.current.pause()
            setIsPlay(false)
        }
    }

    //seek-bar
    const handleChange = (e) => {
        let seekValue = e.target.value;
        const video = videoRef.current

        if (video) {
            const newTime = (seekValue / 100) * video.duration
            video.currentTime = newTime
            seekValue = newTime
        }
    }

    const [seek, setSeek] = useState(0)
    useEffect(() => {
        const video = videoRef.current

        //default volume
        video.volume = 0.08

        const seekBar = document.querySelector('.seek-bar')

        const handleSeek = () => {

            const progress = (video.currentTime / video.duration) * 100
            seekBar.style.width = `${progress}%`
            setSeek(progress)
            const minute = Math.floor(video.currentTime / 60)
            let second = Math.floor(video.currentTime % 60)
            second = second < 10 ? `0${second}` : second
            setCurrentTime(`${minute}:${second}`)
        }

        //total-time
        function handleLoadMetadata() {
            const totalTime = videoRef.current?.duration
            const minutes = Math.floor(totalTime / 60)
            let second = Math.floor(totalTime % 60)
            second = second < 10 ? `0${second}` : second
            setTotaltime(`${minutes}:${second}`)
        }

        videoRef.current?.addEventListener('loadedmetadata', handleLoadMetadata)

        if (video) {
            video.addEventListener('timeupdate', handleSeek)
        }
        if (data) {
            if (Hls.isSupported()) {
                const hls = new Hls({
                    fragLoadingTimeOut: 20000,  // Increase fragment loading timeout to 20 second     // Retry loading a fragment 6 times
                    fragLoadingRetryDelay: 2000, // 2 seconds delay between retries
                })
                hls.loadSource(data)
                hls.attachMedia(videoRef?.current)

                hls.on(Hls.Events.MANIFEST_PARSED, () => {

                    const availableLevels = hls.levels.map((level) => (
                        {
                            height: level.height,
                            index: level.level
                        }
                    ))
                    setQualityLevels(availableLevels)
                    videoRef.current.play()
                })
                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.log("Hls error", data)
                })
                setHlsInstance(hls)
            }
            else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {

                videoRef.current.src = data;
            }
        }
        if (videoRef.current) {
            setIsPlay(true)
            videoRef.current.play()
        }
        return () => {
            if (video) {
                video.removeEventListener('timeupdate', handleSeek)
            }

        }

    }, [data])

    //volume-controller

    let volumLevel = document.querySelector('.vulume-bar-visible')
    const setvolume = (e) => {
        volumLevel.style.width = `${e.target.value}%`
        if (videoRef.current) {
            videoRef.current.volume = e.target.value / 100
        }
    }

    //full screen
    const [fullScreen, setFullScreen] = useState(false)
    const screenHandle = () => {
        setFullScreen((prev) => !prev)
    }

    //setting
    const [visible, setVisible] = useState(false)
    const viewSetting = () => {
        setQualityScreen(false)
        setPlayBAckscreen(false)
        setVisible((prev) => !prev)
    }

    const [playBackcscreen, setPlayBAckscreen] = useState(false)
    const handleplayBAck = () => {
        setQualityScreen(false)
        setPlayBAckscreen((prev) => !prev)

    }

    const playbackSpeed = (value) => {
        setPlayBAckscreen(false)
        videoRef.current.playbackRate = value
    }

    const [qualityScreen, setQualityScreen] = useState(false)
    const handleQualityScreen = () => {
        setPlayBAckscreen(false)
        setQualityScreen((prev) => !prev)
    }

    const handleQuality = (value) => {
        hlsInstance.currentLevel = value
    }

    // fetchh-recomended videos

    const control = controlRef.current
    control?.addEventListener('mouseover', () => {
        control.style.opacity = 1
    })
    control?.addEventListener('mouseleave', () => {
        control.style.opacity = 0
    })

    return (
        <div className={fullScreen ? 'video fullScreen' : "video"}>
            <video id='my-video' ref={videoRef}></video>
            <div ref={controlRef} className="video-controls">
                <div className='status-bar'>
                    <p>{currentTime}</p>
                    <div className="bar">
                        <input type="range" id="status-bar" min='0' max='100' onChange={handleChange} value={seek} />
                        <div className="seek-bar"></div>
                    </div>
                    <p>{totalTime}</p>
                </div>
                <div className='video-controls-upper'>
                    <div className="controller-left">
                        <i onClick={handlePlay} className={isPlay ? "ri-pause-fill" : 'ri-play-fill'}></i>
                        <i className="ri-skip-right-fill"></i>
                        <i className="ri-volume-down-fill"></i>
                        <div className='volume-controller'>
                            <input type="range" id="Volume-bar" min='0' max='100' defaultValue='50' onChange={setvolume} />
                            <div className="vulume-bar-visible"></div>
                        </div>
                    </div>
                    <div className="controller-right">
                        <i onClick={viewSetting} className="ri-settings-3-line"></i>
                        <i onClick={screenHandle} className={fullScreen ? 'ri-fullscreen-exit-fill' : 'ri-fullscreen-line'}></i>
                        {visible && <div className='settings'>
                            <p onClick={handleplayBAck}>Playback Speed</p>
                            {playBackcscreen && <div className='play-back'>
                                <p onClick={() => playbackSpeed(0.5)}>{'>0.5x'}</p>
                                <p onClick={() => playbackSpeed(1)}>{'>1x'}</p>
                                <p onClick={() => playbackSpeed(1.5)}>{'>1.5x'}</p>
                                <p onClick={() => playbackSpeed(2)}>{'>2x'}</p>
                            </div>}
                            <p onClick={handleQualityScreen}>Quality</p>
                            {qualityScreen && <div className='play-back'>
                                {qualityLevels.map((level, indx) => (
                                    <p key={level.height} onClick={() => handleQuality(indx)}>{`>${level.height}p`}</p>
                                ))}
                            </div>
                            }
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Videoplayer