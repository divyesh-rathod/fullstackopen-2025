import axios from "axios";
const baseUrl = "/api/persons";

const GetAll = () => {
  return axios.get(baseUrl);
};

const Add = (data) => {
  return axios.post(baseUrl, data);
};

const DeleteProduct = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const UpdateName = (data) => {
  return axios.put(`${baseUrl}/${data.id}`, data);
};

export default { GetAll, Add, DeleteProduct, UpdateName };
