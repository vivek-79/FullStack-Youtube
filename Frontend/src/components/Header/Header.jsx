import React, { useState } from 'react'
import './Header.css'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toggl } from '../../Store/componentSlice'
import { Link } from 'react-router-dom'
function Header() {

  const authStatus= useSelector((state)=>state.authState.status)
  const dispatch=useDispatch()
  const navigate = useNavigate()

  const [upload,setUpload] = useState(false)

  const handleUpload =()=>{
    setUpload((prev)=>!prev)
  }
  return (
    <header>
      <div className='header-side'>
        <i onClick={()=>dispatch(toggl())} className="ri-list-check"></i>
        <i className="ri-play-large-fill imge"></i>
        <Link className='Link' to="/home"><h2>Youtube</h2></Link>
      </div>
      <div className="header-center">
        <div className='header-search'>
          <input type="text" placeholder='Search'/>
          <i className="ri-search-line"></i>
        </div>
        <div className='voice'>
        <i className="ri-mic-line"></i>
        </div>
      </div>
      <div className="header-side2">
        <i onClick={handleUpload} className="ri-video-add-line"></i>
        {upload && <div className='add-video'>
          <Link className='Link' to='/upload-video'><p onClick={handleUpload}>Video</p></Link>
          <p>|</p>
          <Link className='Link' to='/upload-short'><p onClick={handleUpload}>Short</p></Link>
        </div> }
        <i className="ri-notification-4-line"></i>
        {authStatus ? <div className='header-profile'>
          <img src="https://imgs.search.brave.com/4E-FnJGrz16zTTKMxT6IA176mvQocIm8f9MuFxI-Cp0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kZXNp/Z253aXphcmQuY29t/L2Jsb2cveW91dHVi/ZS10aHVtYm5haWwt/c2l6ZS9yZXNpemUv/YWRkLXRleHQteW91/dHViZS10aHVtYm5h/aWxfMTY1ODc0MTE1/NjEyNF9yZXNpemUu/anBn" alt="" />
        </div>: <button onClick={()=>navigate('/login')}>Login</button>}
      </div>
    </header>
  )
}

export default Header