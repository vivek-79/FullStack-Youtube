import React, { useState } from 'react'
import './Header.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toggl, search } from '../../Store/componentSlice'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { logOut } from '../../Store/AuthSlice'
function Header() {

  const authStatus = useSelector((state) => state.authState.status)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userAvatar= useSelector((state)=>state.authState?.userData?.data?.user?.avatar)
  const [showSearch, setShowSearch] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const [upload, setUpload] = useState(false)

  const handleUpload = () => {
    setUpload((prev) => !prev)
  }

  const handleSearch = (e) => {
    const input = e.target.value
    if (input === '') {
      dispatch(search({}))
    }
    axios.post('/v1/videos/getsearch', { input })
      .then((res) => {
        dispatch(search(res.data.data))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const logoutHandler = () => {
    axios.post('/v1/users/logout')
    .then((res)=>{
      dispatch(logOut())
    })
    setShowProfile(false)
    navigate('/login')
  }

  // const handleVoice=()=>{
  //   console.log('hii')
  //   window.SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition

  //   if(!window.SpeechRecognition){
  //     alert('Your browser dont supports voice search')
  //   }
  //   const recognition = new SpeechRecognition();
  //   recognition.lang = 'en-us';
  //   recognition.interimResults = false
  //   recognition.start();


  //   recognition.addEventListener('result',(event)=>{
  //     const transcript = event.result[0][0].transcript
  //     console.log(transcript)
  //   })

  //   recognition.addEventListener('end',()=>{
  //     recognition.stop();
  //   })

  //   recognition.addEventListener('error',(e)=>{
  //     console.log(e)
  //   })

  //}
  return (
    <header>
      {/*below-492px*/}
      {showSearch && <i id='back-btn' onClick={() => setShowSearch(false)} className="ri-arrow-left-line"></i>}
      {showSearch ? <div className='header-search-mini'>
        <input id='search-mini' onInput={handleSearch} type="text" placeholder='Search' />
        <i id='search-icon' className="ri-search-line"></i>
        <div className='voice'>
          <i className="ri-mic-line"></i>
        </div>
      </div> : <i onClick={() => setShowSearch(true)} className="ri-search-line toggler-icon"></i>}

      {/* above 492px */}
      {!showSearch && <div className='header-side'>
        <i onClick={() => dispatch(toggl())} className="ri-list-check"></i>
        {/* <img src="./public/icon.png" alt="logo" /> */}
        <Link className='Link' to="/home"><h2>ViewVerse</h2></Link>
      </div>}
      <div className="header-center">
        <div className='header-search'>
          <input id='search' onInput={handleSearch} type="text" placeholder='Search' />
          <i className="ri-search-line"></i>
        </div>
        {!showSearch && <div className='voices'>
          <i className="ri-mic-line"></i>
        </div>}
      </div>
      {!showSearch && <div className="header-side2">
        <i id='uploader' onClick={(e) => handleUpload()} className="ri-video-add-line"></i>
        {upload && <div className='add-video'>
          <Link className='Link' to='/upload-video'><p onClick={handleUpload}>Video</p></Link>
          <Link className='Link' to='/upload-short'><p onClick={handleUpload}>Short</p></Link>
        </div>}
        <i id='notification' className="ri-notification-4-line"></i>
        {authStatus ? <div className='header-profile'>
          {showProfile && <div id='profile-setting'>
            <button onClick={logoutHandler}>Logout</button>
          </div>}
          <img onClick={() => setShowProfile((prev) => !prev)} src={userAvatar} alt="" />
        </div> : <button onClick={() => navigate('/login')}>Login</button>}
      </div>}
    </header>
  )
}

export default Header