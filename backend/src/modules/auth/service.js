const prisma = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const env =  require('../../config/env');
const { email } = require('zod');

async function register(data){
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });

    if(existingUser) throw new Error('User already exists');

    const hashedPassword =  await bcrypt.hash(data.password, 256);
    const user = await prisma.user.create({
        data:{
            name: data.name,
            email: data.email,
            password: hashedPassword
        }
    });
    return generateToken(user);
}

const login = async(data) =>{
    const user =  await prisma.user.findUnique({
        where:{email: data.email}
    }) ;
    if(!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(data.password, user.password);
    if(!valid) throw new Error('Invalid credentials');

    return generateToken(user);
}

const generateToken = (user) =>{
    const jwt_token =  jwt.sign(
    {
        userId: user.id,
        email: user.email
    },
    env.JWT_SECRET,
    {expiresIn:"24h"}
);
    return jwt_token;
}

module.exports= {
    register,
    login
};