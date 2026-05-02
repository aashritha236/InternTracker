const express = require("express");
const { MongoClient , ObjectId , ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

const client = new MongoClient(uri , {
serverApi: {
	version : ServerApiVersion.v1,
	strict : true,
	deprecationErrors: true,
	},
});

let internshipsCollection;

async function connectDB(){
	console.log("COnnecting to MongoDB...");
	try{
		await client.connect();
		const db = client.db("interntracker");
		internshipsCollection = db.collection("internships");

		console.log("MongoDB connected successfully");
		}
		catch(error){
			console.log("MongoDB connection failed",error);
		}
	}
connectDB();

app.get("/", (req,res) => {
	res.send("InternTracker API is running");
})

app.post("/internships",async (req,res) => {
	try{
		const internship = {
			company : req.body.company,
			role : req.body.role,
			platform : req.body.platform,
			status: req.body.status || "Applied",
			appliedDate : req.body.appliedDate || new Date().toISOString().split("T")[0],
			notes : req.body.notes || "",
			createdAt : new Date(),
		};
		const result = await internshipsCollection.insertOne(internship);

		res.status(201).json({
			message: "Internship added successfully",
			insertedId: result.insertedId,
			});
		}catch(error){
			res.status(500).json({ message: "Faied to add internship", error});
		}
	});

app.get("/internships", async(req,res) => {
	try{
		const internships = await internshipsCollection
			.find()
			.sort({ createdAt : -1 })
			.toArray();

			res.json(internships);
		}catch(error){
			res.status(500).json({message: "Failed to fetch internships", error});
		}
});

app.put("/internships/:id", async(req,res) => {
	try{
		const id = req.params.id;

    const updatedData = {
      $set: {
        company: req.body.company,
        role: req.body.role,
        platform: req.body.platform,
        status: req.body.status,
        appliedDate: req.body.appliedDate,
        notes: req.body.notes,
      },
    };

    const result = await internshipsCollection.updateOne(
      { _id: new ObjectId(id) },
      updatedData
    );

    res.json({
      message: "Internship updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update internship", error });
  }
});

app.delete("/internships/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await internshipsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.json({
      message: "Internship deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete internship", error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
