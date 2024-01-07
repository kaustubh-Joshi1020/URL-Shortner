const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const app = express();
const PORT = 8001;
const path = require('path')
const staticRoute = require("./routes/staticRouter")

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

//template views
app.set("view engine",'ejs');
app.set('views',path.resolve("./views"))

//middlewares
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  // console.log(entry.redirectURL);
  res.redirect("https://"+entry.redirectURL);
});

app.use('/', staticRoute);


app.use("/url", urlRoute);

// app.get("/analytics/:shorturl",async(req,res)=>{
//   const shortid = req.params.shorturl;
//   const result = await URL.findOne({ shortid });
//   return res.json({
//     totalClicks: result.visitHistory.length,
//     analytics: result.visitHistory,
//   });
// })

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
