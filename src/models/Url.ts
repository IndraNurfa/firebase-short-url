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
    isCustom: {
      type: Boolean,
      default: false,
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

// Add index for faster lookups
UrlSchema.index({ shortUrl: 1 });

export default mongoose.models.Url || mongoose.model('Url', UrlSchema);
