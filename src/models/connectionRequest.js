const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "accepted", "rejected", "interested"],
        message: "{VALUE} is not a valid status type",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//middleware called just before saving the data
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.toUserId === connectionRequest.fromUserId.toString()) {
    throw new Error("Cannot send connection req to self");
  }

  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
