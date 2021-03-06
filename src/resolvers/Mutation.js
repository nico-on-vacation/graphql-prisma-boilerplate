import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {       
        const password = await hashPassword(args.data.password)
        const user = await prisma.mutation.createUser({
            data:{
                ...args.data,
                password
            }
        })

        return{
            user,
            token: await generateToken(user.id)
        }
    },
    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.deleteUser({where:{id:userId}},info)
    },
    async updateUser(parent, args, { prisma, request }, info){
        const userId = getUserId(request)

        if(typeof args.data.password === 'string'){
            args.data.password = await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({
            where:{
                id:userId
            },
            data: args.data
        }, info)
    },
    async login(parent, args, { prisma }, info){
        const user = await prisma.query.user({
            where:{
                email:args.data.email
            }
        })

        if(!user){
            throw new Error('Unable to login')
        }

        const passwordMatches = await bcrypt.compare(args.data.password, user.password)
        if(!passwordMatches){
            throw new Error('Unable to login')
        }

        return {
            user,
            token: await generateToken(user.id)
        }
    }
}

export {Mutation as default}