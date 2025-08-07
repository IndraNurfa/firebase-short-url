import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema(
  {
    longUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, // Hide the __v field
  }
);

export default mongoose.models.Url || mongoose.model('Url', UrlSchema);
