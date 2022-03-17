import mongoose from "mongoose";


export interface IPassword{
    siteId: string,
    site: string,
    username: string,
    password: string,
    date: number
}

interface IUser{
    userId: string, 
    username: string,
    password: string,
    loginDate: number,
    accounts: Array<IPassword>
}

const schema = new mongoose.Schema<IUser & Document>({
    userId: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    loginDate: {type: Number, default: Date.now(), required: true, unique: false},
    accounts: {type: [Object], required: true}
});

export const User = mongoose.model("User", schema);
