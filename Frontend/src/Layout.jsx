
import {Header,Footer} from './components/index'
import{Register} from './pages/index'
import { Outlet } from 'react-router-dom'

import React from 'react'

function Layout() {
  return (
    <div>
        <Header/>
        <div className='pages'>
        {<Outlet/>}
        </div>
        <Footer/>
    </div>
  )
}

export default Layout