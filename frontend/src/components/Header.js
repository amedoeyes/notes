import { useEffect, useRef, useState } from "react";
import theme from "../theme";

const Search = ({ setSearch }) => {
	const handleChange = (e) => {
		setSearch(e.target.value);
	};

	return (
		<div className="searchContainer">
			<i className="searchIcon fa-solid fa-magnifying-glass"></i>
			<input
				className="searchField"
				type="search"
				placeholder="Search"
				onChange={handleChange}
			/>
		</div>
	);
};

const ToggleShowImportantButton = ({ showImportant, setShowImportant }) => {
	const handleClick = () => {
		setShowImportant((curr) => !curr);
	};
	return (
		<button onClick={handleClick}>
			{showImportant ? (
				<i className="fa-regular fa-star"></i>
			) : (
				<i className="fa-solid fa-star"></i>
			)}
		</button>
	);
};

const AccountPanelButton = ({ setAccountPanelVisibility }) => {
	const handleClick = () => {
		setAccountPanelVisibility((curr) => !curr);
	};

	return (
		<button className="accountPanelButton" onClick={handleClick}>
			<i className="fa-solid fa-user"></i>
		</button>
	);
};

const ToggleThemeButton = () => {
	const [currentTheme, setCurrentTheme] = useState(theme.getTheme());
	const handleClick = () => {
		theme.toggleTheme();
		setCurrentTheme(theme.getTheme());
	};

	return (
		<button onClick={handleClick}>
			{currentTheme === "light" ? (
				<i className="fa-solid fa-moon"></i>
			) : (
				<i className="fa-solid fa-sun"></i>
			)}
		</button>
	);
};

const AccountPanel = ({
	user,
	setUser,
	setAccountDialogForm,
	setAccountPanelVisibility,
}) => {
	const accountPanelRef = useRef();

	useEffect(() => {
		accountPanelRef.current.focus();
	}, []);

	const handleBlur = (e) => {
		if (
			!e.currentTarget.contains(e.relatedTarget) &&
			!e.relatedTarget?.classList.contains("accountPanelButton")
		)
			return setAccountPanelVisibility(false);
	};

	const handleClick = (form) => {
		return () => {
			if (form === "logout") {
				localStorage.removeItem("user");

				setUser(null);
				setAccountPanelVisibility(false);
				return;
			}

			setAccountDialogForm(form);
			setAccountPanelVisibility(false);
		};
	};

	return (
		<div
			ref={accountPanelRef}
			className="accountPanel"
			tabIndex="0"
			onBlur={handleBlur}
		>
			{user && (
				<div>
					<p>{user.name}</p>
					<p>@{user.username}</p>
				</div>
			)}
			<div className="accountPanelButtonsContainer">
				{!user ? (
					<>
						<button onClick={handleClick("signup")}>Sign Up</button>
						<button onClick={handleClick("login")}>Login</button>
					</>
				) : (
					<button onClick={handleClick("logout")}>Logout</button>
				)}
			</div>
		</div>
	);
};

const Header = ({
	setSearch,
	showImportant,
	setShowImportant,
	user,
	setUser,
	setAccountDialogForm,
}) => {
	const [accountPanelVisibility, setAccountPanelVisibility] = useState(false);

	return (
		<header>
			<h2 className="userSelectNone">Notes</h2>
			<div className="headerContainer">
				<Search setSearch={setSearch} />
				<div className="headerContainer">
					<ToggleShowImportantButton
						setShowImportant={setShowImportant}
						showImportant={showImportant}
					/>
					<AccountPanelButton
						setAccountPanelVisibility={setAccountPanelVisibility}
					/>
					{accountPanelVisibility && (
						<AccountPanel
							user={user}
							setUser={setUser}
							setAccountDialogForm={setAccountDialogForm}
							setAccountPanelVisibility={
								setAccountPanelVisibility
							}
						/>
					)}
					<ToggleThemeButton />
				</div>
			</div>
		</header>
	);
};

export default Header;
