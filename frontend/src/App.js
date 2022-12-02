import { useEffect, useState } from "react";
import theme from "./theme";
import Header from "./components/Header";
import Main from "./components/Main";
import AccountDialog from "./components/AccountDialog";

const App = () => {
	const [showImportant, setShowImportant] = useState(false);
	const [search, setSearch] = useState("");
	const [user, setUser] = useState();
	const [accountDialogForm, setAccountDialogForm] = useState(null);

	useEffect(() => {
		const loggedUser = JSON.parse(localStorage.getItem("user"));
		loggedUser && setUser(loggedUser);

		theme.setTheme();
	}, []);

	return (
		<>
			<Header
				setSearch={setSearch}
				setShowImportant={setShowImportant}
				user={user}
				setUser={setUser}
				setAccountDialogForm={setAccountDialogForm}
			/>
			{accountDialogForm && (
				<AccountDialog
					accountDialogForm={accountDialogForm}
					setAccountDialogForm={setAccountDialogForm}
					setUser={setUser}
				/>
			)}
			<Main showImportant={showImportant} search={search} user={user} />
		</>
	);
};

export default App;
