import { model, Schema, Types } from 'mongoose';
import { Product, ProductSchema } from './product.model';

export interface OrderItem {
    product: Product;
    glassSize: string;
    price: number;
    quantity: number;
}

export const OrderItemSchema = new Schema<OrderItem>(
    {
        product: { type: ProductSchema, required: true },
        glassSize: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }
);

export interface Order {
    id: string;
    statusOrder: string;
    user: Types.ObjectId;
    name: string;
    phone: string;
    address: string;
    complement: string;
    numberHouse: string;
    cep: string;
    city: string;
    stateUF: string;
    district: string;
    paymentId: string;
    statusPayment: string;
    typePayment: string;
    items: OrderItem[];
    glassSize: string;
    deliveryAddress: string;
    deliveryTax: number;
    totalPrice: number;
    totalPriceToPay: number;
    createdAt: Date;
    updatedAt: Date
}

export const orderSchema = new Schema<Order>({
    statusOrder: { type: String, default: "NOVO" },
    user: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    complement: { type: String, required: false },
    numberHouse: { type: String, required: true },
    cep: { type: String, required: true },
    city: { type: String, required: true },
    stateUF: { type: String, required: true },
    district: { type: String, required: true },
    paymentId: { type: String },
    statusPayment: { type: String, default: "AWAITING PAYMENT" },
    typePayment: { type: String },
    items: { type: [OrderItemSchema], required: true },
    deliveryAddress: { type: String, required: true },
    deliveryTax: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    totalPriceToPay: { type: Number, required: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});


export const OrderModel = model<Order>('order', orderSchema);