import mongoose, {model, Schema, models} from "mongoose";

const ServiceSchema = new Schema ({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    images: [{type: String}],
    category: {type:mongoose.Types.ObjectId, ref:'Category'},
})

export const Service = models.Service || model('Service', ServiceSchema);