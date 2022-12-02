import axios from "axios";

const url = "/api/users";

const create = async (user) => {
	const res = await axios.post(url, user);
	return res.data;
};

const modules = {
	create,
};

export default modules;
