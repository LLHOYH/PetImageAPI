const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
var similarity = require("compute-cosine-similarity");
const app = express();
const csv = require("csv-parser");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

app.listen(3000, () => {
  console.log("listening");
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.get("/compareSimilarities", async (req, res) => {
  // let {postID,userID,category,phone,place,imageByte} = req.body;

  
  const image = fs.readFileSync('/Users/lloyd/Desktop/Unihack/PetImageAPI/black.JPG');
  let searchEmbedding= await getEmbeddings(image)
  let similarResults=[];


  let csvFilePath = "output.csv";
  const rows = [];

  const stream = fs.createReadStream(csvFilePath);
  const jsonFilePath = 'data.json';

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
  
    try {
      // Parse JSON data into JavaScript objects
      const jsonData = JSON.parse(data);
      const searchEm = searchEmbedding.split(",").map((str) => parseInt(str))
      jsonData.forEach(imageEm => {
        let imageEmbedding = JSON.parse(imageEm.image).data;
        console.log(imageEmbedding.length,searchEm.length)
        // const similarityScore = similarity(imageEmbedding,searchEm)
        // similarResults.push({
        //     postID: imageEm.postID,
        //     similarityScore: similarityScore
        // })
        // console.log(similarResults)
      });
    } catch (error) {
      console.error('Error parsing JSON data:', error);
    }
  });

//   // Parse the CSV data
//   stream
//     .pipe(csv())
//     .on("data", (row) => {
//       rows.push(row);
//     })
//     .on("end", () => {
//       console.log("CSV file processed , calculating cosine similarities .....");
//       let similarResults = []
//       rows.forEach((row)=>{
//         // let {image:imageEmbedding} = row;
//         const imageEmbedding = row.image.split(",").map((str) => parseInt(str))
//         searchEmbedding = searchEmbedding.split(",").map((str) => parseInt(str))
//         console.log(imageEmbedding.length , searchEmbedding.length)
//         const similarityScore = similarity(searchEmbedding,imageEmbedding)
//         similarResults.push({
//             postID: row.postID,
//             similarityScore: similarityScore
//         })
//         console.log(similarResults)
//       })
//     })
//     .on("error", (error) => {
//       console.error("Error:", error.message);
//       // Send an error response if an error occurs during processing
//       res.status(500).send("Error processing CSV file");
//     });
 

  // // Handle POST request
  // const requestData = req.body;
  // console.log('Received data:', requestData);
  // res.send(requestData);
});


async function getEmbeddings(imageByte){
    let params = {
        data: imageByte,
      };

        let url="https://zr1hmbzyc2.execute-api.ap-southeast-1.amazonaws.com/dev/api/uploadPost"
      let data = axios.post(url, params)
  .then((response) => {
    return response.data;
    // Handle response data
  })
  .catch((error) => {
    console.error('Error:', error.message);
    // Handle errors
  });

  return data
}

async function sendSMS(phone_number) {
  let msg = "We have found matches with high similarities.";
  let sender = "WheresMyPet";
  let url =
    "https://1d7eqpxzki.execute-api.ap-southeast-2.amazonaws.com/Dev/SMS-sender";

  let params = {
    phone_number: phone_number,
    message: msg,
    sender: sender,
  };
  let header = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };

  axios
    .post(url, params)
    .then((response) => {
      // Handle successful response
      console.log("Response:", response.data);
    })
    .catch((error) => {
      // Handle error
      console.error("Error:", error.message);
    });
}
