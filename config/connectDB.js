const mongoose = require("mongoose");

module.exports = async () => {
  const connect = await mongoose.connect(process.env.MONGO_DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (process.env.STAGE === "dev") {
    console.log(`Connected to DB: ${connect.connection.host}`);
  }
};
