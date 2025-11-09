import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// create New Product

const createProduct = async (formData) => {
  const response = await axios.post(`${BACKEND_URL}/api/products/`, formData);
  return response.data;
};

const getProducts = async () => {
  const response = await axios.get(`${BACKEND_URL}/api/products/`);
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(`${BACKEND_URL}/api/products/` + id);
  return response.data;
};

const getProduct = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/api/products/` + id);
  return response.data;
};

const updateProduct = async (id, formData) => {
  const response = await axios.patch(
    `${BACKEND_URL}/api/products/` + id,
    formData
  );
  return response.data;
};

export const productService = {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  getProducts,
};