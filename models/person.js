const mongoose = require("mongoose");

const password = "user1234";

const url = process.env.MONGO_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => console.log("Successfully connected to database"))
  .catch((err) => console.log("Error connecting to database", err));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
