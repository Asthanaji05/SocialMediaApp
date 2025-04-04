import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: { type: String, index: true }, 
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  password: { type: String }, // Only for email-password users
  image: { type: String },
  userName: { type: String, unique: true, trim: true, index: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], 
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  about: { type: String, trim: true },
}, { timestamps: true });



export default mongoose.model('User', UserSchema);
