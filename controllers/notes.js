const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (req, res) => {
	const notes = await Note.find({}).populate("user", {
		notes: 0,
	});
	res.json(notes);
});

notesRouter.get("/:id", async (req, res) => {
	const note = await Note.findById(req.params.id);
	note ? res.json(note) : res.status(404).end();
});

const getToken = (req) => {
	const authorization = req.get("authorization");
	if (authorization && authorization.toLowerCase().startsWith("bearer "))
		return authorization.substring(7);
	return null;
};

notesRouter.post("/", async (req, res) => {
	const { content, important } = req.body;

	const token = getToken(req);
	const decodeToken = jwt.verify(token, process.env.SECRET);

	if (!decodeToken)
		return res.status(401).json({ error: "token missing or invalid" });

	const user = await User.findById(decodeToken.id);
	const note = new Note({
		content,
		important: important || false,
		date: new Date(),
		user: user._id,
	});

	let savedNote = await note.save();
	savedNote = await savedNote.populate("user", { notes: 0 });

	user.notes = user.notes.concat(savedNote._id);
	await user.save();

	res.status(201).json(savedNote);
});

notesRouter.put("/:id", async (req, res) => {
	const { content, important } = req.body;

	const updatedNote = await Note.findByIdAndUpdate(
		req.params.id,
		{ content, important },
		{ new: true, runValidators: true, context: "query" }
	).populate("user", { notes: 0 });
	res.json(updatedNote);
});

notesRouter.delete("/:id", async (req, res) => {
	await Note.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

module.exports = notesRouter;
