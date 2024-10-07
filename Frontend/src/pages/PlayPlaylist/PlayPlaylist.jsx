

import React from 'react'
import './PlayPlaylist.css'
import { useLocation } from 'react-router-dom'
import { Card, SideCard } from '../../components'

function PlayPlaylist() {

    const location = useLocation()
    const { playList } = location.state
    const video=playList?.videos
    console.log(video)
    return (
        <div className='play-playlist'>
            <div className="play-playlist-head">
                <div className='play-playlist-wallPaper'>
                    <img src={playList.videos[0].thumbnail} alt="" />
                </div>
                <div className="play-playlist-info">
                    <p>..</p>
                    <div className='head-info'>
                        <p>{playList.name} <i className="ri-play-circle-line"></i></p>
                    </div>
                </div>
            </div>
            <div className="play-playlist-content">
            {video && video.map((item)=>(
                <Card
                 title={item.title}
                 thumbnail={item.thumbnail}
                 owner={item.owner[0].userName}
                 avatar={item.owner[0].avatar}
                />
            ))}
            </div>
        </div>
    )
}

export default PlayPlaylist