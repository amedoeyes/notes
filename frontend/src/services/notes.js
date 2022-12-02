import axios from "axios";
const url = "/api/notes";

let token;

let setToken = (newToken) => {
	token = `bearer ${newToken}`;
};

const getAll = async () => {
	const res = await axios.get(url);
	return res.data;
};

const create = async (newNote) => {
	const config = {
		headers: { Authorization: token },
	};
	const res = await axios.post(url, newNote, config);
	return res.data;
};

const update = async (id, note) => {
	const res = await axios.put(`${url}/${id}`, note);
	return res.data;
};

const remove = async (id) => {
	const res = await axios.delete(`${url}/${id}`);
	return res.data;
};

const modules = { setToken, getAll, create, update, remove };

export default modules;
