const mongoose = require("mongoose");

const dbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/my-drive";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
