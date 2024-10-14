

import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Aside.css'
import axios from 'axios'
import { useSelector } from 'react-redux'
function Aside() {

    const [channels,setChannels] = useState([])
    const userId = useSelector((state) => state.authState.userData?.data?.user?._id)
    useEffect(()=>{
        axios.get('/v1/users/subscribed')
        .then((res)=>{
            setChannels(res.data?.data?.[0].channel)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[userId])
    const asideOptions = [
        {
            name: 'Home',
            auth: true
        },
        {
            name: 'Shorts',
            auth: true,
        },
        {
            name: 'Subscriptions',
            auth: true
        },
    ]
    const youOptions =
        [
            'You  >',
            'Your channel',
            'History',
            'Playlists',
            'Watch later',
        ]

    return (
        <aside>
            <div className='aside-home'>
                {asideOptions.map((item, key) => (
                    <NavLink to={`/${item.name.toLowerCase()}`}  className={({ isActive }) => (isActive ? 'option active' : 'option')} key={item.name}>{item.name}</NavLink>
                ))}
                <hr />
                {youOptions.map((element) => (
                    <NavLink to={`/${element}`}  className={({ isActive }) => (isActive ? 'option active' : 'option')} key={element}>{element}</NavLink>
                ))}
                <hr />
                <p> Subscriptions</p>
                {channels && channels.map((element) => (
                    <NavLink to={`/${element}`}  className={({ isActive }) => (isActive ? 'option active' : 'option')} key={element._id}>{element?.userName}</NavLink>
                ))}
            </div>
        </aside>
    )
}

export default Aside