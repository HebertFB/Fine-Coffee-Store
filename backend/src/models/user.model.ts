import { Schema, model } from "mongoose";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    numberHouse: string;
    cep: string;
    city: string;
    stateUF: string;
    district: string;
    complement: string;
    isAdmin: boolean;
    isOwner: boolean;
}

export const UserSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    numberHouse: { type: String, required: true },
    cep: { type: String, required: true },
    city: { type: String, required: true },
    stateUF: { type: String, required: true },
    district: { type: String, required: true },
    complement: { type: String, required: false },
    isAdmin: { type: Boolean, required: true },
    isOwner: { type: Boolean, required: true }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});


export const UserModel = model<User>('user', UserSchema);