const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => console.log("Successfully connected to database"))
  .catch((err) => console.log("Error connecting to database", err));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, "name is required"],
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, "number is required"],
    validate: {
      validator: (v) => {
        return /^(\d{2,3}-)?\d+$/.test(v);
      },
      message: "invalid number format",
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
