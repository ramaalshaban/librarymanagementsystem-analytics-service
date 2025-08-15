const { mongoose } = require("common");
const { Schema } = mongoose;
const analyticsnapshotSchema = new mongoose.Schema(
  {
    snapshotType: {
      type: String,
      required: true,
    },
    scopeType: {
      type: String,
      required: true,
      defaultValue: "personal",
    },
    scopeId: {
      type: String,
      required: false,
    },
    timeRange: {
      type: Schema.Types.Mixed,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    generatedBy: {
      type: String,
      required: false,
    },
    note: {
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

analyticsnapshotSchema.set("versionKey", "recordVersion");
analyticsnapshotSchema.set("timestamps", true);

analyticsnapshotSchema.set("toObject", { virtuals: true });
analyticsnapshotSchema.set("toJSON", { virtuals: true });

module.exports = analyticsnapshotSchema;
