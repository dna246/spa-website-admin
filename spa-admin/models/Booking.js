import mongoose, {model, models, Schema} from "mongoose";

const BookedServiceSchema = new Schema({
    serviceId: {
        type: mongoose.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    unit_amount: {
        type: Number,
        required: true
    }
});

const BookingSchema = new Schema ({
    userEmail: String,
    name: String,
    email: String,
    phone: String,
    bookedServices: [BookedServiceSchema],
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
        type: String,
        enum: ['Đang xử lý', 'Xác nhận', 'Huỷ bởi YLA', 'Đã Huỷ', 'Đã Hoàn Thành'],
    },
    isCompleted: { type: Boolean, default: false },
}, {
    timestamps: true,
})

export const Booking = models?.Booking || model('Booking', BookingSchema)