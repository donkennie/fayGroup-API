import UserModel from "../models/user.model";
import jwtToken from '../utils/jwtToken';
import {ObjectId} from 'mongodb';
import jwt from 'jsonwebtoken';

class UserService{
    private user = UserModel;

    public async register(
        _id: ObjectId,
        name: string,
        email: string,
        profilePicture: string,
        password: string
    ): Promise<string | Error>{
        try {
            const existingUser = await this.user.findOne({ email });
            if (existingUser != null){
                throw new Error("User already exists.");
            }

            const newUser = await this.user.create({
                _id: new ObjectId(),
                name,
                email,
                profilePicture
            });

            const accessToken = jwtToken.createToken(newUser)
            return newUser._id.toHexString();
        } catch (error) {
            throw new Error("You've entered wrong credentials");
        }
    }
 

    public async Login(email: string, 
        password: string,
        accessType: string
    ): Promise<{token: string; profilePicture: string; name: string; email: string} | Error>{
        {
            try {
                const user = await this.user.findOne({ email })

                if (!user) {
                    throw new Error('Unable to find user with that username');
                }

                 
            if(await user.isValidPassword(password)){
                const token = jwtToken.createToken(user);
                return {token, profilePicture: user.profilePicture, name: user.name, email: user.email};
            }

            else{
                throw new Error('Wrong credentials given');
            }
            } catch (error) {
                throw new Error("Something went wrong");
            }

        }
    }


}