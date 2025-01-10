import gallery from "./gallery.json" assert {type: 'json'};

import { MongoClient } from "mongodb";
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://127.0.0.1:27017/";
// Create a new client and connect to MongoDB
const client = new MongoClient(uri);
async function run() {
  try {
    // Connect to the "t9" database and access its "cards" collection
    const database = client.db("final");
    const artCollection = database.collection("gallery");
    const artistCollection = database.collection("artist");
    const userCollection = database.collection("users");
    const commentCollection = database.collection("comments")
    const likesCollection = database.collection("likes")
    const workshopCollection = database.collection("workshop")
    const followCollection = database.collection("follow")

  
	const result1 = await artCollection.drop();
  const result2 = await artistCollection.drop();
  const result3 = await userCollection.drop();
  const result6 = await commentCollection.drop();
  const result7 = await likesCollection.drop();
  const result8 = await workshopCollection.drop();
  const result9 = await followCollection.drop();
	if(result1){
		console.log("Art has been dropped.")
	}
  if(result2){
		console.log("Artists have been dropped.")
	}
  if(result3){
		console.log("Users have been dropped.")
	}
  if(result6){
		console.log("Comment has been dropped.")
	}
  if(result7){
		console.log("Like have been dropped.")
	}
  if(result8){
		console.log("Workshop have been dropped.")
	}
  if(result9){
		console.log("Follow have been dropped.")
	}

  let artists = [];
  let users = []; 
  let temp = {};

  for (let art in gallery) {
    temp[gallery[art].Artist] = gallery[art].Artist;
  }

  for (let artist in temp) {
    users.push({"username": artist, "password": "password", "artists": true});
    artists.push({"artistName": artist})

  }

  // Insert the defined document into the "cards" collection
  const result = await artCollection.insertMany(gallery);
  const result4 = await artistCollection.insertMany(artists);
  const result5 = await userCollection.insertMany(users);
  console.log("Successfuly inserted " + result.insertedCount + " supplies.");
  
} finally {
     // Close the MongoDB client connection
    await client.close();
  }
}
// Run the function and handle any errors
run().catch(console.dir);