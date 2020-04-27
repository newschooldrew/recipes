const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const createToken = (user, secret, expiresIn) =>{
    
    const {username,email} = user;

    return jwt.sign({username,email},secret, {expiresIn})
}

exports.resolvers = {
    Query:{
        getAllRecipes: async (root,args,{Recipe}) =>{
            const allRecipes = await Recipe.find().sort({
                createdDate:'desc'
            })
            return allRecipes;
        },
        getUserRecipes: async (root,{username},{Recipe}) =>{
            const userRecipes = await Recipe.find({username}).sort({
                createdDate:'desc'
            })
            return userRecipes;
        },
        getCurrentUser: async (root,args,{currentUser, User}) =>{
            if(!currentUser) return null
            const user = await User.findOne({username:currentUser.username})
            .populate({
                path:'favorites',
                model:'Recipe'
            })
            return user;
        },
        getRecipe: async(root, {_id}, {Recipe}) =>{
            const recipe = await Recipe.findOne({_id})
            return recipe
        },
        searchRecipes:async (root,{searchTerm},{Recipe}) =>{
            if(searchTerm){
                const searchResults = await Recipe.find({
                    $text:{ $search: searchTerm },
                }, {
                    score:{ $meta: "textScore"}
                }).sort({
                    score:{$meta:"textScore"}
                })
                return searchResults;
            } else{
                const foundRecipes = await Recipe.find().sort({
                    likes:'desc',
                    createdDate:'desc'
                })
                return foundRecipes
            }
        }
    },
    Mutation:{
        updateUserRecipe:async(root,{_id,name,description, instructions,
            category, username},{Recipe}) =>{
                const updatedRecipe = await Recipe.findOneAndUpdate(
                    {_id},
                    {$set:{name, description,category,instructions}},
                    {new:true}
                )
                return updatedRecipe
            }
        ,
        deleteUserRecipe:async (root,{_id},{Recipe}) =>{
            const recipe = await Recipe.findOneAndRemove({_id})
            return recipe
        },
        likeRecipe:async (root,{username,_id},{User,Recipe}) =>{
            const recipe = await Recipe.findOneAndUpdate({_id},{
                $inc:{likes:1}})
            const user = await User.findOneAndUpdate({username},{$addToSet:{favorites:_id}})
            return recipe
        },
        unlikeRecipe: async(root,{username,_id},{Recipe,User}) => {
            const recipe = await Recipe.findOneAndUpdate({_id},{$inc:{likes: - 1}})
            const user = await User.findOneAndUpdate({username},{$pull:{favorites:_id}})
            return recipe
        }
        ,
        addRecipe: async (root,{name,description, instructions,
             category, username}, {Recipe}) => {
                const newRecipe = await new Recipe({
                    name,
                    description,
                    category,
                    instructions,
                    username
                }).save()
                return newRecipe
        },
        signupUser: async (root,{username,email,password},{User})=>{
            const user = await User.findOne({username})

            if(user){
                throw new Error('user already exists')
            }
            const newUser = await new User({
                username,
                email,
                password
            }).save()
            return {token:createToken(newUser,process.env.SECRET,"1hr")}
        },
        signinUser: async (root,{username,password},{User}) =>{
            const foundUser = await User.findOne({username})

            if(!foundUser) {
                throw new Error('user not found')
            }
            const isValidated = await bcrypt.compare(password,foundUser.password)
            if(!isValidated){
                throw new Error('invalid password')
            }
            return {token:createToken(foundUser,process.env.SECRET,"1hr")}
        }
    }
}