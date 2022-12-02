import { useEffect, useRef, useState } from "react";
import usersService from "../services/users";
import loginService from "../services/login";
import noteService from "../services/notes";

function DialogHeader({ accountDialogForm, setAccountDialogForm }) {
	const handleClick = () => setAccountDialogForm(null);

	return (
		<div className="accountDialogHeader">
			<button className="closeAccountDialogButton" onClick={handleClick}>
				<i className="fa-solid fa-xmark"></i>
			</button>
			<h1>
				{accountDialogForm === "signup" && "Sign Up"}
				{accountDialogForm === "login" && "Login"}
			</h1>
		</div>
	);
}

const ErrorMessage = ({ errorMessage, setErrorMessage }) => {
	useEffect(() => {
		let timeout;
		const startTimeout = () =>
			(timeout = setTimeout(() => {
				setErrorMessage(null);
			}, 5000));

		const stopTimeout = () => clearTimeout(timeout);

		stopTimeout();
		startTimeout();

		return () => stopTimeout();
	});

	return <p className="accountDialogErrorMessage">{errorMessage.error}</p>;
};

const SignUpForm = ({ setAccountDialogForm, setErrorMessage }) => {
	const nameRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const name = nameRef.current.value;
		const username = usernameRef.current.value;
		const password = passwordRef.current.value;

		if (!name.trim() || !username.trim() || !password.trim()) return;

		try {
			await usersService.create({ name, username, password });

			nameRef.current.value = "";
			usernameRef.current.value = "";
			passwordRef.current.value = "";

			setAccountDialogForm("");
		} catch (err) {
			setErrorMessage(err.response.data.error);
			setErrorMessage({ error: err.response.data.error });
		}
	};

	return (
		<form className="accountDialogForm" onSubmit={handleSubmit}>
			<div className="accountFieldContainer">
				<i className="accountFieldIcon fa-solid fa-user"></i>
				<input
					ref={nameRef}
					className="accountField"
					type="text"
					placeholder="Name"
					autoFocus
					required
				/>
			</div>
			<div className="accountFieldContainer">
				<i className="accountFieldIcon fa-solid fa-user"></i>
				<input
					ref={usernameRef}
					className="accountField"
					type="text"
					placeholder="Username"
					autoFocus
					required
				/>
			</div>
			<div className="accountFieldContainer">
				<i className="accountFieldIcon fa-solid fa-lock"></i>
				<input
					ref={passwordRef}
					className="accountField"
					type="password"
					placeholder="Password"
					required
				/>
			</div>
			<button>
				Sign Up&nbsp;
				<i className="fa-solid fa-right-to-bracket"></i>
			</button>
		</form>
	);
};

const LoginForm = ({ setAccountDialogForm, setUser, setErrorMessage }) => {
	const usernameRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const username = usernameRef.current.value;
		const password = passwordRef.current.value;

		if (!username.trim() || !password.trim()) return;

		try {
			const user = await loginService.login({ username, password });
			noteService.setToken(user.token);

			usernameRef.current.value = "";
			passwordRef.current.value = "";

			localStorage.setItem("user", JSON.stringify(user));

			setUser(user);
			setAccountDialogForm(null);
		} catch (err) {
			setErrorMessage({ error: err.response.data.error });
		}
	};

	return (
		<>
			<form className="accountDialogForm" onSubmit={handleSubmit}>
				<div className="accountFieldContainer">
					<i className="accountFieldIcon fa-solid fa-user"></i>
					<input
						className="accountField"
						ref={usernameRef}
						type="text"
						placeholder="Username"
						autoFocus
						required
					/>
				</div>
				<div className="accountFieldContainer">
					<i className="accountFieldIcon fa-solid fa-lock"></i>
					<input
						className="accountField"
						ref={passwordRef}
						type="password"
						placeholder="Password"
						required
					/>
				</div>
				<button>
					Login&nbsp;
					<i className="fa-solid fa-right-to-bracket"></i>
				</button>
			</form>
		</>
	);
};

const AccountDialog = ({
	accountDialogForm,
	setAccountDialogForm,
	setUser,
}) => {
	const [errorMessage, setErrorMessage] = useState(null);

	const handleClick = () => setAccountDialogForm(null);

	return (
		<div className="accountDialogContainer">
			<div className="backdrop" onClick={handleClick}></div>
			<div className="accountDialog">
				<DialogHeader
					accountDialogForm={accountDialogForm}
					setAccountDialogForm={setAccountDialogForm}
				/>
				{errorMessage && (
					<ErrorMessage
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
					/>
				)}
				{accountDialogForm === "signup" && (
					<SignUpForm
						setAccountDialogForm={setAccountDialogForm}
						setErrorMessage={setErrorMessage}
					/>
				)}
				{accountDialogForm === "login" && (
					<LoginForm
						setAccountDialogForm={setAccountDialogForm}
						setUser={setUser}
						setErrorMessage={setErrorMessage}
					/>
				)}
			</div>
		</div>
	);
};

export default AccountDialog;
