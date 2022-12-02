const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./testHelper");
const app = require("../app");
const api = supertest(app);
const Note = require("../models/note");

beforeEach(async () => {
	await Note.deleteMany({});
	await Note.insertMany(helper.initialNotes);
});
describe("when there is initially some notes saved", () => {
	test("notes are returned as json", async () => {
		await api
			.get("/api/notes")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all notes are returned", async () => {
		const response = await api.get("/api/notes");
		expect(response.body).toHaveLength(helper.initialNotes.length);
	});

	test("a specific note is within the returned notes", async () => {
		const response = await api.get("/api/notes");
		const contents = response.body.map((note) => note.content);
		expect(contents).toContain("Browser can execute only Javascript");
	});
});

describe("viewing a specific note", () => {
	test("succeeds with a valid id", async () => {
		const notes = await helper.notesInDb();

		const note = notes[0];

		const resultNote = await api
			.get(`/api/notes/${note.id}`)
			.expect(200)
			.expect("Content-Type", /application\/json/);

		const processedNote = JSON.parse(JSON.stringify(note));
		expect(resultNote.body).toEqual(processedNote);
	});

	test("fails with statuscode 404 if note does not exist", async () => {
		const validNonexistingId = await helper.nonExistingId();

		console.log(validNonexistingId);

		await api.get(`/api/notes/${validNonexistingId}`).expect(404);
	});

	test("fails with statuscode 400 id is invalid", async () => {
		const invalidId = "5a3d5da59070081a82a3445";

		await api.get(`/api/notes/${invalidId}`).expect(400);
	});
});

describe("addition of a new note", () => {
	test("succeeds with valid data", async () => {
		const note = {
			content: "async/await simplifies making async calls",
			important: true,
		};

		await api
			.post("/api/notes")
			.send(note)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const notes = await helper.notesInDb();
		expect(notes).toHaveLength(helper.initialNotes.length + 1);

		const contents = notes.map((note) => note.content);
		expect(contents).toContain("async/await simplifies making async calls");
	});

	test("fails with status code 400 if data invalid", async () => {
		const newNote = {
			important: true,
		};

		await api.post("/api/notes").send(newNote).expect(400);

		const notes = await helper.notesInDb();
		expect(notes).toHaveLength(helper.initialNotes.length);
	});
});
describe("deletion of a note", () => {
	test("succeeds with status code 204 if id is valid", async () => {
		const notes = await helper.notesInDb();
		const note = notes[0];

		await api.delete(`/api/notes/${note.id}`).expect(204);
		const notesAfterDelete = await helper.notesInDb();

		expect(notesAfterDelete).toHaveLength(helper.initialNotes.length - 1);

		const contents = notesAfterDelete.map((note) => note.content);
		expect(contents).not.toContain(note.content);
	});
});

afterAll(() => mongoose.connection.close());
