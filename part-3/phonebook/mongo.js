const e = require("cors");
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.phmpfjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const phoneSchema = new mongoose.Schema({
  name: String,
  number: Number
});

const Entry = mongoose.model("Entry", phoneSchema);

const entry = new Entry({
    name: "Divyesh101 Rathod",
    number:992440277
});

entry.save().then((result) => {
  console.log("note saved!");
});

Entry.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});