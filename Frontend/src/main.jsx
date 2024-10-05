import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Layout from './Layout.jsx'
import {createBrowserRouter,createRoutesFromElements,RouterProvider,Route} from 'react-router-dom'
import {Provider} from  'react-redux'
import store from './Store/Store.js'
import { Home, Login, Register ,Video,Upload, Short,UploadShort,Channel,WatchHist} from './pages/index.js'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='home' element={<Home/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/videos/:videoId' element={<Video/>}/>
      <Route path='/upload-video' element={<Upload/>}/>
      <Route path='/upload-short' element={<UploadShort/>}/>
      <Route path='/Shorts' element={<Short/>}/>
      <Route path='/Your channel' element={<Channel/>}/>
      <Route path='/History' element={<WatchHist/>}/>
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>,
)
