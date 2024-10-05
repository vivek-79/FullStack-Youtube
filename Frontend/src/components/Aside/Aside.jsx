

import React from 'react'
import { NavLink } from 'react-router-dom'
import './Aside.css'
function Aside() {

    const asideOptions=[
        {
            name:'Home',
            auth:true
        },
        {
            name:'Shorts',
            auth:true,
        },
        {
            name:'Subscriptions',
            auth:true
        },
    ]
    const youOptions=
        [
            'You  >',
            'Your channel',
            'History',
            'Playlists',
            'Watch later',
        ]
    const subscription=[
        'Harry',
        'Potter',
        'Raja',
        'Arijit',
        'Diljit'
    ]
  return (
    <aside>
        <div className='aside-home'>
        {asideOptions.map((item,key)=>(
           <NavLink to={`/${item.name.toLowerCase()}`} className={({isActive})=>(isActive?'option active':'option')} key={item.name}>{item.name}</NavLink> 
        ))}
        <hr />
        {youOptions.map((element )=> (
            <NavLink to={`/${element}`} className={({isActive})=>(isActive?'option active':'option')} key={element}>{element}</NavLink> 
        ))}
        <hr />
        <p>Subscriptions</p>
        {subscription.map((element )=> (
            <NavLink to={`/${element}`} className={({isActive})=>(isActive?'option active':'option')} key={element}>{element}</NavLink>
        ))}
        </div>
    </aside>
  )
}

export default Aside