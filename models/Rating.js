// Optional: Rating schema definition for documentation
// MongoDB is schemaless, so this is just for reference

const ratingSchema = {
  propertyId: {
    type: String,
    required: true
  },
  propertyName: {
    type: String,
    required: true
  },
  propertyThumbnail: {
    type: String,
    required: true
  },
  reviewerName: {
    type: String,
    required: true
  },
  reviewerEmail: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true
  },
  reviewDate: {
    type: String, // ISO String
    default: () => new Date().toISOString()
  }
};

module.exports = ratingSchema;