const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    original_name: {
      type: String,
      required: true,
      trim: true,
    },
    aws_data: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const File = mongoose.model('File', fileSchema)

module.exports = File
