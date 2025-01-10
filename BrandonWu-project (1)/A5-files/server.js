import express from 'express';
import ConnectMongoDBSession from 'connect-mongodb-session';
import session from 'express-session';
const MongoDBStore = ConnectMongoDBSession(session);
const app = express();

const store = new MongoDBStore ({
    url: 'mongodb://127.0.0.1:27017/a5',
    collection: 'sessiondata'
});

app.use(session ({
    secret: 'some secret key here',
    resave: true,
    saveUninitialized: true
}))

app.use(function (req, res, next) {
    console.log(req.session);
    next();
});



app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "pug");

app.use(function(req,res,next){
    console.log(req.method);
    console.log(req.url);
    console.log(req.path);
    console.log(req.get("Content-Type"));
    next();
});

app.get("/", home);
app.get("/gallery", galleryPage);
app.get("/login", loginPage);
app.get("/newaccount", createAccountPage);
app.get("/artistpage", artistPage);
app.put("/login",checkLogIn ,login);
app.post("/login",checkLogIn ,createAccount);
app.get("/gallery/:id", galleryData);
app.post("/comments", checkNotLogIn, comments);
app.post("/likes", checkNotLogIn, likes);
app.put("/checkTitle", checkTitle);
app.post("/gallery", checkNotLogIn, addArt);
app.get("/addArt", addArtPage)
app.get("/addWorkShop", addWorkshopPage)
app.post("/workshop", checkNotLogIn, checkArtist, postWorkshop)
app.get("/workshop", workshopPages)
app.get("/artist/:a", artistPageOne)
app.get("/workshop/:a", workshopPage)
app.post("/follow", checkNotLogIn, follow)
app.post("/enroll", checkNotLogIn, enroll)
app.put("/search", search)
app.get("/search", searchPage)
app.delete("/likes", removeLike)
app.delete("/comments", removeComments)
app.get("/profile", profilePage)
app.post("/switchAccount", switchAccount)
app.delete("/follow", unfollow)
app.post("/logout", logout)
app.use((req, res, next) => {
    res.status(404).send('Not Found');
})

async function follow(req, res) {
    let id = req.body.artistId
    let b = await req.app.locals.artistCollection.findOne({"_id": new ObjectId(id)})
    let a = await req.app.locals.followCollection.insertOne({"userFollow": req.session.user.username, "userFollowed": b.artistName, "noti": []})
    if (a) {
        res.status(201).send("Follow Successful")
    } else {
        res.status(500).send("Follow Failed")
    }
}

async function profilePage(req, res) {
    try {
        let data1 = await req.app.locals.likesCollection.find({"userLike": req.session.user.username}).toArray()
        let data2 = await req.app.locals.commentsCollection.find({"userComment": req.session.user.username}).toArray()
        let data3 = await req.app.locals.userCollection.findOne({"username": req.session.user.username})
        let data4 = await req.app.locals.followCollection.find({"userFollow": req.session.user.username}).toArray()
        res.render("./profile", {data1, data2, data3, data4})
    } catch {
        res.render("./main")
    }
}

async function removeLike(req, res) {
    let data = req.body;
    data.userLike = req.session.user.username
    let result = await req.app.locals.likesCollection.deleteOne(data);
    console.log(result)
    if (result) {
        res.status(201).send("Like Removed");
    } else {
        res.status(500).send("Error occured");
    }
}

async function unfollow(req, res) {
    let data = req.body;
    let result = await req.app.locals.followCollection.deleteOne({"_id": new ObjectId(data._id)});
    if (result) {
        res.status(201).send("Unfollowed");
    } else {
        res.status(500).send("Error occured");
    }
}

async function logout(req, res) {
    req.session.user = undefined
    res.status(201).send("Logged out")
}

async function switchAccount(req, res) {
    let a = await req.app.locals.userCollection.findOne({"username": req.session.user.username})
    if (a.artists) {
        let b = await req.app.locals.userCollection.updateOne({"username": req.session.user.username},{$set:{"artists": false}})
        res.status(201).send("Switched to Patron")
    } else {
        let c = await req.app.locals.artistCollection.findOne({"artistName": req.session.user.username})
        if (c) {
            let d = await req.app.locals.userCollection.updateOne({"username": req.session.user.username},{$set:{"artists": true}})
            res.status(201).send("Switched to Artist")
        } else {
            res.status(500).send("Add artwork to gallery to become an artist")
        }
    }

}

async function removeComments(req, res) {
    let data = req.body;
    data.userComment = req.session.user.username 
    let result = await req.app.locals.commentsCollection.deleteOne(data);
    if (result) {
        res.status(201).send("Comment Removed");
    } else {
        res.status(500).send("Error occured");
    }
}

async function checkTitle(req, res) {
    let data = req.body;
    let result = await req.app.locals.artCollection.findOne(data);
    if (result) {
        res.status(500).send("Same title already exists");
    } else {
        res.status(201).send("No duplicate titles exist");
    }
}

async function search(req, res) {
    let data = req.body;
    let result = await req.app.locals.artCollection.find(data).toArray();
    if (result) {
        res.status(201).json(result);
    }
}

async function enroll(req, res) {
    let data = req.body;
    let result = await req.app.locals.workshopCollection.updateOne({"_id":new ObjectId(data._id)}, {$push:{"enroll": req.session.user.username}});
    console.log(result);
    if (result.acknowledged) {
        res.status(201).send("Successful");
    } else {
        res.status(501).send("Not successful");
    }
}

async function addArt(req, res) {
    let data = req.body;
    data.Artist = req.session.user.username 
    let result = await req.app.locals.artCollection.insertOne(data);
    console.log(result);
    if (result) {
        let text = "artwork: " + data.Title;
        res.status(201).send("Art added successfully");
        let a = await req.app.locals.followCollection.updateMany({"userFollowed": req.session.user.username},{$push:{ "noti": text}})
        console.log(a);
        let b = await req.app.locals.artistCollection.insertOne({"artistName": req.session.user.username})
        
    } else {
        res.status(500).send("Error occured");
    }
}

async function postWorkshop(req, res) {
    let data = req.body;
    data.user = req.session.user.username
    data.enroll = []
    let result = await req.app.locals.workshopCollection.insertOne(data);
    console.log(result);
    if (result) {
        res.status(201).send("Workshop posted");
        let text = "workshop: " + data.name;
        let a = await req.app.locals.followCollection.updateMany({"userFollowed": req.session.user.username},{$push:{ "noti": text}})
        console.log(a)
    } else {
        res.status(500).send("Error occured");
    }
}


async function createAccount(req, res) {
    let data = req.body;
    data.artist = false;
    let a = await req.app.locals.userCollection.findOne({"username": data.username});
    console.log(a)
    if (a){
        res.status(500).send("Error has occurred");
        return;
    }
    let result = await req.app.locals.userCollection.insertOne(data);
    if (result) {
        req.session.save();
        req.session.user = data;
        res.status(201).send("Create account successful");
    } else {
        res.status(500).send("Error has occurred");
    }
}

async function login(req, res) {
    let data = req.body;
    let result = await req.app.locals.userCollection.findOne(data);
    if (result) {
        req.session.save();
        req.session.user = data;
        
        res.status(201).send("Log in successful");
    } else {
        res.status(500).send("Error has occurred");
    }
}

async function comments(req, res) {
    let data = req.body;
    data.userComment = req.session.user.username;
    let result = await req.app.locals.commentsCollection.insertOne(data);
    if (result) {
        
        res.status(201).send("Comment posted");
    } else {
        res.status(500).send("Error has occurred");
    }
}

async function likes(req, res) {
    let data = req.body;
    data.userLike = req.session.user.username;
    let artTitle = await req.app.locals.artCollection.findOne({"_id": new ObjectId(data.artLocation)});
    data.title = artTitle.Title;
    let result = await req.app.locals.likesCollection.insertOne(data);
    if (result) {
        
        res.status(201).send("User liked");
    } else {
        res.status(500).send("Error has occurred");
    }
}

function checkNotLogIn(req, res, next) {
    if (req.session.user == undefined) {
      return res.status(401).send('User not logged in');
    }
    next();
  
}

async function checkArtist(req, res, next) {
    let artist = await req.app.locals.artistCollection.findOne({"artistName":req.session.user.username})
    console.log(artist)
    if (artist == undefined) {
        console.log("LEAVE")
      return res.status(401).send('User not an artist');
    }
    next();
  
}

function checkLogIn(req, res, next) {
    if (req.session.user != undefined) {
      return res.status(401).send('User already logged in');
    }
    next();
  
}

function addArtPage(req, res) {
    res.render("./addArt");
}

function searchPage(req, res) {
    res.render("./search");
}

function addWorkshopPage(req, res) {
    res.render("./addWorkShop");
}

function home(req, res) {
    res.render("./main");
}

function loginPage(req, res) {
    res.render("./login");
}

function createAccountPage(req, res) {
    res.render("./newAccount");
}

async function galleryPage(req, res) {
    try {
        const data = await req.app.locals.artCollection.find().toArray();
        res.status(201).render("./gallery", {data});
    } catch {

    }
}

async function workshopPages(req, res) {
    const data = await req.app.locals.workshopCollection.find().toArray();
    res.status(201).render("./workshops", {data});
}

async function artistPage(req, res) {
    try {
        const data = await req.app.locals.artistCollection.find().toArray();
        res.status(201).render("./artists", {data});
    } catch {

    }
}

async function artistPageOne(req, res) {
    try {
        let artistId = new ObjectId(req.params.a);
        const data = await req.app.locals.artistCollection.findOne({"_id":artistId});
        let artistName = data.artistName;
        const data2 = await req.app.locals.artCollection.find({"Artist":artistName}).toArray();
        const data3 = await req.app.locals.workshopCollection.find({"user":artistName}).toArray();
        res.status(201).render("./artist", {data, data2, data3});
    } catch {

    }
}

async function workshopPage(req, res) {
    let workshopId = new ObjectId(req.params.a);
    const data = await req.app.locals.workshopCollection.findOne({"_id":workshopId});
    console.log(data)
    res.status(201).render("./workshop", {data});
}

async function galleryData(req, res) {
    try {
        let id = req.params.id;
        const artData = await req.app.locals.artCollection.findOne({"_id": new ObjectId(id)});
        const review = await req.app.locals.commentsCollection.find({"artLocation": id}).toArray();
        const likes = await req.app.locals.likesCollection.find({"artLocation": id}).toArray();
        const artist = await req.app.locals.artistCollection.findOne({"artistName": artData.Artist});
        let reviewArray = [];
        for (let i in review){
            reviewArray.push(review[i].comments);
        }
        res.status(201).render("./galleryData", {"artData" : artData, "reviews" : reviewArray, "i" : likes.length, "id" : artist._id});
    } catch {
        
    }
}



import { MongoClient, ObjectId } from "mongodb";

// uri - MongoDB deployment's connection 
const uri = "mongodb://127.0.0.1:27017/";
// Create a new client and connect to MongoDB
const client = new MongoClient(uri);
let db = client.db("final");
app.locals.artCollection = db.collection("gallery");
app.locals.userCollection = db.collection("users");
app.locals.artistCollection = db.collection("artist");
app.locals.workshopCollection = db.collection("workshop");
app.locals.commentsCollection = db.collection("comments");
app.locals.likesCollection = db.collection("likes");
app.locals.followCollection = db.collection("follow");

async function run() {
	try {
		
	} finally {
		console.log("Server running on Port 3000")
		app.listen(3000);

	}
}
// Run the function and handle any errors
run().catch(console.dir);