import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
name: {
    type: String,
    required: [true, "Please enter category name"],
    unique: true,
    trim: true
  },

  image: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
    createdAt: {
        type: Date,
        default: Date.now 
    }
})

export default mongoose.model("Category", categorySchema)