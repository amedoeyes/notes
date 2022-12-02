import axios from "axios";
const url = "/api/login";

const login = async (user) => {
	const res = await axios.post(url, user);
	return res.data;
};

const modules = {
	login,
};

export default modules;
