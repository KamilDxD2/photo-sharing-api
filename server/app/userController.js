import model from './model.js'
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
config();
const { sign, verify } = jsonwebtoken;
const { hash, compare } = bcryptjs;
const { Users } = model;

const userController = {
    getuser: () => {
        return Users.map(({ password, ...user }) => user)
    },
    adduser: async (obj) => {
        if (Users.some(user => user.email === obj.email) || Users.some(user => user.name === obj.name)) {
            return "Email or Name Already Exists"
        }
        else {
            const encryptPass = async (password) => {

                let encryptedPassword = await hash(password, 10);
                return encryptedPassword
            }
            const createToken = () => {

                let token = sign(
                    {
                        email: obj.email,
                    },
                    process.env.KEY, // key powinien być zapisany w .env
                    {
                        expiresIn: "1h" // "1m", "1d", "24h"
                    }
                );
                return token
            }

            obj.id = new Date().getTime()
            obj.confirmed = false
            obj.password = await encryptPass(obj.password)
            let token = createToken()
            Users.push(obj)

            return `Open this link to confirm your account (valid for 1 hour): http://localhost:${process.env.APP_PORT}/api/user/confirm/${token}`;
        }

    },
    verifyuser: async (token) => {
        const verifyToken = async (token) => {
            try {
                let decoded = verify(token, process.env.KEY)
                let User = Users.find(user => user.email === decoded.email)
                User.confirmed = true

                let userDir = path.join('uploads', User.name);
                if (!fs.existsSync(userDir)) {
                    fs.mkdirSync(userDir);
                }

                let albumDir = path.join(userDir, `album`);
                if (!fs.existsSync(albumDir)) {
                    fs.mkdirSync(albumDir);
                }

                const { password, ...user } = User
                return user
            }
            catch (ex) {
                return { message: ex.message };
            }
        }
        return await verifyToken(token)


    },
    verifyToken: (token) => {
        try {
            verify(token, process.env.KEY)
            return { message: "token verified successfully" }
        }
        catch (ex) {
            return { message: ex.message };
        }
    },
    loginuser: async (obj) => {
        const decryptPass = async (userpass, encrypted) => {

            let decrypted = await compare(userpass, encrypted)
            return decrypted

        }
        const createToken = (obj) => {

            let token = sign(
                {
                    email: obj.email,
                },
                process.env.KEY, // key powinien być zapisany w .env
                {
                    expiresIn: "1h" // "1m", "1d", "24h"
                }
            );
            return token
        }
        let User = Users.find(user => user.email == obj.email)
        if (User) {
            if (await decryptPass(obj.password, User.password)) {
                return { message: "logged in", token: createToken(obj) }
            }
            else {
                return "Incorrect Password"
            }
        }
        else {
            return "User doesn't exist"
        }


    },


}

export default userController;