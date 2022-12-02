import { useEffect, useRef, useState } from "react";
import noteService from "../services/notes";

const User = ({ user }) => {
	return (
		<p className="userFlex">
			{user.name} <span className="username">@{user.username}</span>
		</p>
	);
};

const NoteForm = ({ setNotes, user }) => {
	const textareaRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!textareaRef.current.value.trim()) return;

		const note = {
			content: textareaRef.current.value.trim(),
			important: false,
		};

		const savedNote = await noteService.create(note);
		setNotes((notes) => notes.concat(savedNote));
		textareaRef.current.value = "";
	};

	return (
		<div className="mainColumn noteFormWrapper">
			<User user={user} />
			<form className="noteForm" onSubmit={handleSubmit}>
				<textarea
					ref={textareaRef}
					placeholder="Note"
					rows={5}
					required
				/>
				<button type="submit">Save</button>
			</form>
		</div>
	);
};

const ToggleNoteImportanceButton = ({ setNotes, note }) => {
	const handleClick = async () => {
		try {
			const updatedNote = await noteService.update(note.id, {
				...note,
				important: !note.important,
			});

			setNotes((notes) =>
				notes.map((_note) =>
					_note.id === note.id ? updatedNote : _note
				)
			);
		} catch (err) {
			noteService.getAll();
		}
	};

	return (
		<button onClick={handleClick}>
			{note.important ? (
				<i className="fa-solid fa-star"></i>
			) : (
				<i className="fa-regular fa-star"></i>
			)}
		</button>
	);
};

const DeleteNoteButton = ({ setNotes, note }) => {
	const handleClick = async () => {
		try {
			await noteService.remove(note.id);

			setNotes((notes) => notes.filter((_note) => _note.id !== note.id));
		} catch (err) {
			noteService.getAll();
		}
	};

	return (
		<button onClick={handleClick}>
			<i className="fa-solid fa-trash-can"></i>
		</button>
	);
};

const Note = ({ note, setNotes }) => {
	const date = new Date(note.date);
	const locale = navigator.language;
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const localDate = date.toLocaleDateString(locale, {
		timeZone: timeZone,
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
	});
	const localTime = date.toLocaleTimeString(locale, {
		timeZone: timeZone,
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="mainColumn">
			<User user={note.user} />
			<p className="noteContent">{note.content}</p>
			<p className="noteDate">{`${localDate} ${localTime}`}</p>
			<div className="noteButtonsContainer">
				<ToggleNoteImportanceButton setNotes={setNotes} note={note} />
				<DeleteNoteButton setNotes={setNotes} note={note} />
			</div>
		</div>
	);
};

const Notes = ({ notes, setNotes, showImportant, search }) => {
	const filterImportant = showImportant
		? notes.filter((note) => note.important === true)
		: notes;

	const filteredNotes = search
		? filterImportant.filter((note) =>
				note.content.toLowerCase().includes(search.toLowerCase())
		  )
		: filterImportant;

	return (
		<div className="notes">
			{filteredNotes
				.map((note) => (
					<Note key={note.id} note={note} setNotes={setNotes} />
				))
				.reverse()}
		</div>
	);
};

const Main = ({ showImportant, search, user }) => {
	const [notes, setNotes] = useState([]);
	const mainRef = useRef();

	useEffect(() => {
		noteService.getAll().then((res) => {
			setNotes(res);
		});
	}, []);

	useEffect(() => {
		mainRef.current.style.maxHeight =
			window.innerHeight -
			document.querySelector("header").clientHeight +
			"px";
	}, [user]);

	useEffect(() => {
		window.onresize = () => {
			mainRef.current.style.maxHeight =
				window.innerHeight -
				document.querySelector("header").clientHeight +
				"px";
		};
	}, []);

	return (
		<main ref={mainRef}>
			{user && <NoteForm setNotes={setNotes} user={user} />}
			<Notes
				notes={notes}
				setNotes={setNotes}
				showImportant={showImportant}
				search={search}
			/>
		</main>
	);
};

export default Main;
