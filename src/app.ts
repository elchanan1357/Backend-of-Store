import express from 'express';
const app = express()

import dotenv from 'dotenv'
dotenv.config()

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

import mongoose from 'mongoose';
mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on("error",(error) => console.log(error))
db.once("open" ,() => console.log("connect to DB"))

app.listen(process.env.PORT,()=> console.log("Server start in port: " ,process.env.PORT))
