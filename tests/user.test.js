import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, login, getProfile, getUsers } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
    const variables = {
        data:{
            name: 'ben',
            email: 'ben@exmaple.com',
            password: 'red12345'
        }
    }

    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const isMatch = await prisma.exists.User({
        id: response.data.createUser.user.id
    })

    expect(isMatch).toBe(true)
})

test('Should expose public author profiles', async() => {
    const response = await client.query({query: getUsers})

    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
})

test('Should not login with bad credentials', async() => {
    const variables = {
        data:{
            email:"nico@example.com",
            password:"wrongpassword"
        }
    }

    await expect(
        client.mutate({ 
            mutation: login,
            variables
        })
    ).rejects.toThrow()
})

test('Should not be able to sign up with short password', async() => {
    const variables = {
        data:{
            name:'Henry',
            email:'henry@example.com',
            password:'toShort'
        }
    }
    
    await expect(
        client.mutate({
            mutation: createUser,
            variables
        })
    ).rejects.toThrow()
})

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)

    const { data } = await client.query({query: getProfile})

    expect(data.me.id).toBe(userOne.user.id)
})

