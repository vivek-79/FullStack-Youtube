
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Short.css'
import { ShortComp } from '../../components'
import { useSelector } from 'react-redux'

function Short() {
    ///get-shorts

    const userId = useSelector((state)=>state.authState.userData?.data?.user._id)

    const [data,setData]= useState([])
    useEffect(()=>{
        axios.post('/v1/short/get-shorts',{userId})
            .then((res) => {
                setData(res.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    },[])
  return (
    <div className='shorts'>
        {data ?.map((data)=>(
            <ShortComp key={data.short} data={data}/>
        ))}
    </div>
  )
}

export default Short