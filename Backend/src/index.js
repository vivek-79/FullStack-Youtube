import dotenv from 'dotenv'
import { app } from "./App.js";
import connectDb from "./Db/index.js";

dotenv.config({
    path:'./env',
})

connectDb()

.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is Online And Listening on port:${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log('Failed To Connect')
})