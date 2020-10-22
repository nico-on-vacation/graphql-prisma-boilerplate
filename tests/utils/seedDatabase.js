import prisma from '../../src/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userOne = {
    input:{
        name:"Nico",
        email:"nico@example.com",
        password: bcrypt.hashSync("PokemonRed123",10)
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input:{
        name:"jess",
        email:"jess@example.com",
        password: bcrypt.hashSync("PokemonBlue123",10)
    },
    user: undefined,
    jwt: undefined
}

const seedDatabase = async() => {
    //delete test data
    await prisma.mutation.deleteManyUsers()

    //create userOne
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    //Create userTwo
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })
    userTwo.jwt = jwt.sign({ userid: userTwo.user.id }, process.env.JWT_SECRET)
}

export {seedDatabase as default, userOne, userTwo }