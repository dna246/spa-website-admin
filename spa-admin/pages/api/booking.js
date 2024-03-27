import {mongooseConnect} from "@/lib/mongoose";
import {Booking} from "@/models/Booking";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    await mongooseConnect()
    await isAdminRequest(req, res)
    res.json(await Booking.find().sort({createdAt:-1}));
}