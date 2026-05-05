import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: '', 
  },
  image: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });


export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
