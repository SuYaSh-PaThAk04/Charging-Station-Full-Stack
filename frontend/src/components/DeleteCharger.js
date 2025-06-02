const handleDelete = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:4000/api/chargers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    alert("Charger deleted!");
    // Optionally refresh the list
  } catch (err) {
    alert("Error: " + err.message);
  }
};

export default handleDelete