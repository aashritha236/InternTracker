const express = require("express");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
	origin: "http://localhost:5173",
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "user-email"]
}));
app.use(express.json());

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

let internshipsCollection;
let profilesCollection;
let usersCollection;

async function connectDB() {
	console.log("Connecting to MongoDB...");
	try {
		await client.connect();
		const db = client.db("interntracker");
		internshipsCollection = db.collection("internships");
		profilesCollection = db.collection("profiles");
		usersCollection = db.collection("users");
		console.log("MongoDB connected successfully");
	}
	catch (error) {
		console.log("MongoDB connection failed", error);
	}
}
connectDB();

app.get("/", (req, res) => {
	res.send("InternTracker API is running");
})

app.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ message: "Please fill all fields" });
		}

		const existingUser = await usersCollection.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists with this email." });
		}

		await usersCollection.insertOne({ name, email, password, createdAt: new Date() });
		
		await profilesCollection.insertOne({ 
			userEmail: email, 
			name, 
			email, 
			phone: "", 
			college: "", 
			title: "", 
			updatedAt: new Date() 
		});

		res.json({ message: "Registration successful" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "Please fill all fields" });
		}

		const user = await usersCollection.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid user. Please register first." });
		}

		if (user.password !== password) {
			return res.status(400).json({ message: "Incorrect password" });
		}

		res.json({ message: "Login successful", email });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

app.post("/internships", async (req, res) => {
	try {
		const userEmail = req.headers["user-email"];
		if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

		const internship = {
			userEmail,
			company: req.body.company,
			role: req.body.role,
			platform: req.body.platform,
			status: req.body.status || "Applied",
			appliedDate: req.body.appliedDate || new Date().toISOString().split("T")[0],
			notes: req.body.notes || "",
			createdAt: new Date(),
		};
		const result = await internshipsCollection.insertOne(internship);

		res.status(201).json({
			message: "Internship added successfully",
			insertedId: result.insertedId,
		});
	} catch (error) {
		res.status(500).json({ message: "Faied to add internship", error });
	}
});

app.get("/internships", async (req, res) => {
	try {
		const userEmail = req.headers["user-email"];
		if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

		const internships = await internshipsCollection
			.find({ userEmail })
			.sort({ createdAt: -1 })
			.toArray();

		res.json(internships);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch internships", error });
	}
});

app.put("/internships/:id", async (req, res) => {
	try {
		const id = req.params.id;

		const updatedFields = {};

		if (req.body.company !== undefined) updatedFields.company = req.body.company;
		if (req.body.role !== undefined) updatedFields.role = req.body.role;
		if (req.body.platform !== undefined) updatedFields.platform = req.body.platform;
		if (req.body.status !== undefined) updatedFields.status = req.body.status;
		if (req.body.appliedDate !== undefined) updatedFields.appliedDate = req.body.appliedDate;
		if (req.body.notes !== undefined) updatedFields.notes = req.body.notes;

		const userEmail = req.headers["user-email"];
		if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

		const updatedData = { $set: updatedFields };

		const result = await internshipsCollection.updateOne(
			{ _id: new ObjectId(id), userEmail },
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
		const userEmail = req.headers["user-email"];
		if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

		const result = await internshipsCollection.deleteOne({
			_id: new ObjectId(id),
			userEmail,
		});

		res.json({
			message: "Internship deleted successfully",
			deletedCount: result.deletedCount,
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to delete internship", error });
	}
});

app.get("/profile", async (req, res) => {
	try {
		const userEmail = req.headers["user-email"];
		if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

		const profile = await profilesCollection.findOne({ userEmail });

		res.json(
			profile || {
				name: "",
				email: "",
				phone: "",
				college: "",
				title: "",
			}
		);
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch profile",
			error: error.message,
		});
	}
});

app.put("/profile", async (req, res) => {
	try {
		const userEmail = req.headers["user-email"];
		if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

		const profileData = {
			userEmail,
			name: req.body.name || "",
			email: req.body.email || "",
			phone: req.body.phone || "",
			college: req.body.college || "",
			title: req.body.title || "",
			updatedAt: new Date(),
		};

		await profilesCollection.updateOne(
			{ userEmail },
			{ $set: profileData },
			{ upsert: true }
		);

		res.json({
			message: "Profile saved successfully",
			profile: profileData,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to save profile",
			error: error.message,
		});
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
