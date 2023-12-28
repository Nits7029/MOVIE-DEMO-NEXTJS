const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")

const { ObjectId } = mongoose.Schema.Types

if (mongoose.models.movies) {
  module.exports = mongoose.model('movies');
} else {

  const MovieSchema = new mongoose.Schema({
    title: { type: String, trim: true, index: true },
    year: { type: Number, index: true },
    poster: { type: String, trim: true, default: "" },
    createdBy: { type: ObjectId, index: true, ref: "users" },
    isDeleted: { type: Boolean, default: false }
  }, { timestamps: true });

  MovieSchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('movies', MovieSchema);
}