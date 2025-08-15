const { mongoose } = require("common");
const { Schema } = mongoose;
const changestreameventSchema = new mongoose.Schema(
  {
    streamName: {
      type: String,
      required: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    sourceObject: {
      type: String,
      required: false,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: Boolean,
      default: true,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  },
);

changestreameventSchema.set("versionKey", "recordVersion");
changestreameventSchema.set("timestamps", true);

changestreameventSchema.set("toObject", { virtuals: true });
changestreameventSchema.set("toJSON", { virtuals: true });

module.exports = changestreameventSchema;
