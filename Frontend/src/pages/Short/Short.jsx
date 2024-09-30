
import React from 'react'
import './Short.css'

function Short() {
  return (
    <div className='shorts'>
        <div className="short-content">
            <div className="short-video-content"></div>
            <div className="short-info">
                <div className="user-info">
                    <div className="short-avatar"></div>
                    <div className="user-name">
                        <p>Username</p>
                    </div>
                    <button>Subscribe</button>
                </div>
                <div className="short-title">
                    <p>Funny comedy scene</p>
                </div>
            </div>
            <div className="content-comps">
                <i className="ri-thumb-up-line"></i>
                <i className="ri-thumb-down-line"></i>
                <i className="ri-messenger-line"></i>
                <i className="ri-share-forward-line"></i>
                <i className="ri-list-check cont-list"></i>
            </div>
        </div>
    </div>
  )
}

export default Short