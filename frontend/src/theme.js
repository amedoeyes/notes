const getTheme = () => {
	const preferredDarkTheme = window.matchMedia(
		"(prefers-color-scheme: dark)"
	).matches;
	const chosenTheme = localStorage.getItem("theme");
	const theme = chosenTheme
		? chosenTheme
		: preferredDarkTheme
		? "dark"
		: "light";
	return theme;
};

const setTheme = () => {
	document.body.classList.add(getTheme());
};

const toggleTheme = () => {
	const bodyClassList = document.body.classList;
	if (getTheme() === "light") {
		bodyClassList.remove("light");
		bodyClassList.add("dark");
		localStorage.setItem("theme", "dark");
	} else {
		bodyClassList.remove("dark");
		bodyClassList.add("light");
		localStorage.setItem("theme", "light");
	}
};

const modules = { getTheme, setTheme, toggleTheme };

export default modules;
