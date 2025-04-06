import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

const chatSchema = new mongoose.Schema({
   // _id: { type: String, required: true },
    messages: [messageSchema],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Moved inside chatSchema
}, { timestamps: true }); // Added timestamps

const Chats = mongoose.model("chats", chatSchema);
export default Chats;