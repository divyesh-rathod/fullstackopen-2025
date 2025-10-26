const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const Phone = require('./models/phonebook')

const app = express();

app.use(express.static("dist"));


morgan.token("body", (req) => 
     JSON.stringify(req.body)
)
app.use(morgan(":method,:url,:response-time,:body,"));
app.use(bodyParser.json());
app.use(cors())



app.get("/api/persons", (req,res,next) => {
  Phone.find({})
    .then((data)=>{
       res.json(data);
    })
    .catch((err) => next(err));
})

app.get("/api/persons/:id", (req, res,next) => {
  Phone.findById(req.params.id)
    .then((data) => {
       res.json(data);
    })
    .catch((err) => next(err));
})

app.delete("/api/persons/:id", (req, res,next) => {
    const {id} = req.params.id;
    Phone.findByIdAndDelete(id)
    .then(() => {
       res.status(201).json("Person Deleted");
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req,res,next) => {
  const {id} = req.params.id;
  Phone.findByIdAndUpdate(id,
    { number: req.body.number },
    {new:true},
  ).then((data)=>{ res.status(201).json(data)}).catch(err=>next(err))
});

app.post("/api/persons", (req, res,next) => {
    const { name, number } = req.body;
    if (!name || !number) {
      return res.status(400).json({ error: "name and number are required" }); // << add body
    }
   new Phone({
    name,
    number,
  })
    .save()
    .then((saved) => res.status(201).json(saved))
    .catch(err=>next(err))

})

app.get("/info", (req, res,next) => { 
    "this is date"

  const currentDate = new Date().toISOString();
 
  Phone.find({})
    .then((data) => {
      if (data) {
       return res.status(201).json(`the total people in the database are ${data.length} and todays date is ${currentDate}`)
      }
      
        return res.status(500).json("internal server error could not connect to db")
      
  }).catch(err=>next(err))
 
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const ErrorHandler = (err,req,res,nxt) => {
  
  

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformated id" });
  } if (err.name === "ValidationError") {
    return res.status(422).json({ error: err.message });
  }



     nxt(err);
}

app.use(ErrorHandler)

const {PORT} = process.env;
app.listen(PORT, () => {
    console.log("server running on port 3001")
})