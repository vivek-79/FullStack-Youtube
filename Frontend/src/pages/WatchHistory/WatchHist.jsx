

import React, { useEffect, useState } from 'react'
import './WatchHist.css'
import { Card } from '../../components'
import axios from 'axios'
import { useSelector } from 'react-redux'
import ShortDisp from '../../components/ShortDisp'

function WatchHist() {

    const userId = useSelector((state) => state.authState.userData?.data?.user._id)
    const [history, setHistory] = useState('')
    useEffect(() => {
        axios.post('/v1/users/watch-history', { userId })
            .then((res) => {
                setHistory(res.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [userId])

    console.log(history)
    const videoHistory = history?.watchHistoryVideo
    const shortHistory = history?.watchHistoryShort//pending
    console.log(shortHistory)
    return (
        <div className='watch-hist'>
            <div className="watch-hist-video">
                <p className="watch-his-head">Videos</p>
                {videoHistory && videoHistory.map((video) => (
                    <div key={video._id} className='hist-single-elem'>
                        <Card
                            title={video.title}
                            thumbnail={video.thumbnail}
                            views={video.views}
                            owner={video.owner.userName}
                            avatar={video.owner.avatar}
                        />
                    </div>
                ))}
            </div>
            <div className="watch-hist-video2">
                <p className="watch-his-head">Shorts</p>

                {shortHistory && shortHistory.map((short) => (
                    <div key={short._id} className='hist-single-elem2'>
                        <ShortDisp data={short}/>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default WatchHist