import mongoose, { Document } from 'mongoose';
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: 'milk' | 'cheese' | 'yogurt' | 'butter' | 'cream' | 'ice-cream' | 'other';
    image: string;
    stock: number;
    unit: string;
    brand: string;
    expiryDays: number;
    isOrganic: boolean;
    fatContent?: number;
    volume?: number;
    rating: number;
    numReviews: number;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct> & IProduct & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Product.d.ts.map