const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
// connects to database and schema
require('dotenv').config({path:'variables.env'})

//schemas
const Recipe = require('./models/Recipe')
const User = require('./models/User')

const {graphqlExpress,graphiqlExpress} = require('apollo-server-express')
const {makeExecutableSchema} = require('graphql-tools')

//middleware
const cors = require('cors')
const bodyParser = require('body-parser')
const {typeDefs} = require('./schema')
const {resolvers} = require('./resolvers')

const corsOptions = {
    // domain we're making requests from
    origin:'http://localhost:3000',
    credentials:true
}

app.use(cors(corsOptions))

// set up JWT auth middleware

app.use(async (req,res,next) => {
    const token = req.headers['authorization'];

    if(token !== null){
        try{
          const currentUser = await jwt.verify(token,process.env.SECRET);
          req.currentUser = currentUser;
        }catch(err){
          console.error("JWT error is " + err);
        }
      }
    next();
})

// create graphiql app
app.use('/graphiql', graphiqlExpress({endpointURL:'/graphiql'}
//test
))

//creates graphql schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers  
})

mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log('db connected'))
.catch(err => console.error("error is " + err))


// connecting mongoose models to graphql
app.use('/graphql',  bodyParser.json(),graphqlExpress(({currentUser})=>
(({
    schema,
    context:{
        Recipe,
        User,
        currentUser
    }
}))))

const PORT = process.env.PORT || 4444;

app.listen(PORT, () =>{
    console.log(`server listening on Port ${PORT}`)
})