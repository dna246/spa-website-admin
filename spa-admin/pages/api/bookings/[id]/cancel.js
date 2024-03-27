import {mongooseConnect} from "@/lib/mongoose";
import {Booking} from "@/models/Booking";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} not allowed`);
    }

    await mongooseConnect();

    const { id } = req.query;

    try {
        await Booking.findByIdAndUpdate(id, { status: 'Đã Huỷ' });
        res.status(200).json({ success: true, message: 'Booking cancelled by user' });
    } catch (error) {
        console.error('Failed to cancel booking:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
