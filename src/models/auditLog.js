const { mongoose } = require("common");
const { Schema } = mongoose;
const auditlogSchema = new mongoose.Schema(
  {
    actorUserId: {
      type: String,
      required: false,
    },
    actionType: {
      type: String,
      required: true,
    },
    targetObjectType: {
      type: String,
      required: true,
    },
    targetObjectId: {
      type: String,
      required: false,
    },
    context: {
      type: Schema.Types.Mixed,
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

auditlogSchema.set("versionKey", "recordVersion");
auditlogSchema.set("timestamps", true);

auditlogSchema.set("toObject", { virtuals: true });
auditlogSchema.set("toJSON", { virtuals: true });

module.exports = auditlogSchema;
