
import {Router} from 'express'
import { verifyLogin } from '../Middleware/auth.middleware.js'
import { createPlaylist ,getPlayList,addToPlaylist,getVideos} from '../Controllers/playlist.controller.js'

const playListrouter = Router()

playListrouter.use(verifyLogin)

playListrouter.route('/create-playList').post(createPlaylist)
playListrouter.route('/get-playList/:userId').get(getPlayList)
playListrouter.route('/addTo-playlist').post(addToPlaylist)
playListrouter.route('/get-videos').post(getVideos)

export {
    playListrouter
}