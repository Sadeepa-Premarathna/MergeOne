import mongoose, { Document } from 'mongoose';
export interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}
export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart> & ICart & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Cart.d.ts.map