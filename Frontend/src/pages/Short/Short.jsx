
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Short.css'
import { ShortComp } from '../../components'

function Short() {
    ///get-shorts

    const [data,setData]= useState([])
    useEffect(()=>{
        axios.get(`/v1/short/get-shorts`)
            .then((res) => {
                console.log(res.data.data)
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