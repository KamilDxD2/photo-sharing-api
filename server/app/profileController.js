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

const profileController = {

    verifyToken: (token) => {
        try {
            let decoded = verify(token, process.env.KEY)
            let User = Users.find(user => user.email === decoded.email)
            let obj = {
                name: User.name,
                lastName: User.lastName,
                email: User.email,
            }
            return obj
        }
        catch (ex) {
            return { message: ex.message };
        }
    },
    updateProfile: (data, email) => {
        let Email = email
        let User = Users.find(user => user.email == Email)
        User.name = data.name
        User.lastName = data.lastname
        return { name: User.name, lastName: User.lastName, email: User.email }
    }


}

export default profileController;