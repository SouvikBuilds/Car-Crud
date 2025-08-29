import React, { useEffect, useState } from "react";

function App() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    model: "",
    year: "",
    color: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null); // update ke liye

  const API_URL = "https://fastapi-project-car-database.onrender.com";

  // --- Fetch all cars ---
  const fetchCars = () => {
    fetch(`${API_URL}/cars`)
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Error fetching cars:", err));
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // --- Handle input change ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- Add / Update car ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/cars/${editingId}` : `${API_URL}/cars`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: form.model,
        year: parseInt(form.year),
        color: form.color,
        price: parseFloat(form.price),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({ model: "", year: "", color: "", price: "" });
        setEditingId(null);
        fetchCars(); // refresh list
      })
      .catch((err) => console.error("Error saving car:", err));
  };

  // --- Delete car ---
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    fetch(`${API_URL}/cars/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchCars())
      .catch((err) => console.error("Error deleting car:", err));
  };

  // --- Edit car ---
  const handleEdit = (car) => {
    setForm({
      model: car.model,
      year: car.year,
      color: car.color,
      price: car.price,
    });
    setEditingId(car.id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Car CRUD App 🚗</h1>

      {/* --- Form --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <input
          type="text"
          name="model"
          value={form.model}
          onChange={handleChange}
          placeholder="Car Model"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="number"
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="color"
          value={form.color}
          onChange={handleChange}
          placeholder="Color"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {editingId ? "Update Car" : "Add Car"}
        </button>
      </form>

      {/* --- Car List --- */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Car List</h2>
        <div className="grid gap-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {car.model} ({car.year})
                </p>
                <p className="text-gray-600">Color: {car.color}</p>
                <p className="text-gray-600">Price: ${car.price}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(car)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
