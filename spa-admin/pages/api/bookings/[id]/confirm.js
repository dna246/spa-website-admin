import { Booking } from "@/models/Booking";
import { mongooseConnect } from "@/lib/mongoose";

export default async function confirmBooking(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} not allowed`);
    }

    await mongooseConnect();
    const bookingId = req.query.id;

    try {
        const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'Xác nhận' }, { new: true });
        res.status(200).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
