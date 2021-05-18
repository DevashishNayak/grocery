const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({

    full_name: { type: String, required: true },
    line_1: { type: String, required: true },
    line_2: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true, default: 0 },
    phone_no: { type: Number, required: true, minlength: 10 },
    userId: { type: String, required: false }

});
const Address = mongoose.model("Address", AddressSchema);

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    address: { type: AddressSchema },
    products: {
        type: [{
            productId: { type: String },
            productCount: { type: Number },
        }]
    },
    paymentId: { type: String },
    orderId: { type: String },

});
const Order = mongoose.model("Order", OrderSchema);
module.exports = { Order, Address };