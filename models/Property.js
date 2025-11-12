// Optional: Property schema definition for documentation
// MongoDB is schemaless, so this is just for reference

const propertySchema = {
  propertyName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Rent', 'Sale', 'Commercial', 'Land']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  imageLink: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  postedDate: {
    type: String, // ISO String
    default: () => new Date().toISOString()
  }
};

module.exports = propertySchema;