import { Booking } from "@/models/Booking";
import { mongooseConnect } from "@/lib/mongoose";

export default async function confirmBooking(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    await mongooseConnect();
    const bookingId = req.query.id;

    try {
        const existingBooking = await Booking.findById(bookingId);
        if (!existingBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { isCompleted: true }, { new: true }, {status: 'Đã Hoàn Thành'});
        res.status(200).json({ success: true, booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
