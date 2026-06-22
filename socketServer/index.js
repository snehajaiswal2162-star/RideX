import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()
import http from 'http'
import { Server } from 'socket.io'
import userModel from './model/userModel.js'

const port = process.env.PORT
const mongoUrl = process.env.MONGO_URL

const connectDb = async () => {
    try {
        await mongoose.connect(mongoUrl)
        console.log('db connected successfully!')
    } catch (error) {
        console.log("db error",error)
    }
}

const app = express()
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000'
    }
})

app.post('/emit',async (req,res) => {
    const {event, data, userId} = req.body()
    try{
        const user = await userModel.findById(userId)
        if(user.socket){
            io.to(user.socketId).emit(event,data)
        }
        return res.json({success:true})
    }catch(error){
        return res.json({success:false})
    }
})

io.on("connection",(socket)=>{

    socket.on('identity',async (userId)=>{
        socket.userId=userId
        await userModel.findByIdAndUpdate(userId,{
            socketId:socket.id,
            isOnline:true
        })
    })

    socket.on('join ride', async (bookingId) => {
        console.log('join ride',bookingId)
        socket.join(`ride-${bookingId}`)
    })

    socket.on('driver-location-update',({bookingId, latitude, longitude, status})=> {
        io.to(`ride-${bookingId}`).emit('driver location',{
            latitude, 
            longitude
        })
    })

    // socket.on('chat message',({data})=>{
    //     io.to(`ride-${data.bookingId}`).emit('chat message',data)
    // })
    socket.on('chat message', (data) => {
    console.log("Received chat message:", data)

    if (!data) {
        console.log("Data is undefined")
        return
    }

    io.to(`ride-${data.bookingId}`).emit('chat message', data)
})

    socket.on('disconnect', async () =>{
        if(!socket.userId)return
        await userModel.findByIdAndUpdate(socket.userId,{
            socketId:null,
            isOnline:false
        })
    })

    socket.on("update-location", async ({userId, longitude, latitude}) =>{
        if(!socket.userId)return
        await userModel.findByIdAndUpdate(userId,{
            location:{
                type:"Point",
                coordinates:[longitude,latitude]
            }
        })
    })
})

server.listen(port,()=>{
    connectDb()
    console.log('server listen on http://localhost:8000')
})
