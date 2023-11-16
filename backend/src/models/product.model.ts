import { Schema, model } from "mongoose";

export interface Product {
    id: string;
    name: string;
    price: number[];
    glassSize: string[];
    description: string;
    tags: string[];
    imageUrl: string;
    origins: string[];
    preparationTime: string;
}

export const ProductSchema = new Schema<Product>(
    {
        name: { type: String, required: true },
        price: { type: [Number], required: true },
        glassSize: { type: [String], required: true },
        description: { type: String, required: true },
        tags: { type: [String] },
        imageUrl: { type: String, required: true },
        origins: { type: [String], required: true },
        preparationTime: { type: String, required: true },
    }, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
}
);


export const ProductModel = model<Product>('product', ProductSchema);