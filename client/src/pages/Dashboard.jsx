import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/user.context";
import axios from "axios";

export default function Dashboard() {
  const { user, fetchUserProfile } = useContext(UserContext);
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    if (!user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to your backend API with the barcode
      const response = await axios.post(`/api/v1/products/search/${barcode}`);
      console.log("Product search response:", response.data);
    } catch (error) {
      console.error("Error searching product:", error);
    }
  };

  const handleBarcodeChange = (e) => {
    // Ensure only numbers are entered in the barcode input field
    const value = e.target.value.replace(/\D/g, "");
    setBarcode(value);
  };

  return (
    <div>
      {user ? (
        <div>
          <div>Welcome, {user.username}!</div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="barcode">Product Barcode:</label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={barcode}
              onChange={handleBarcodeChange}
              pattern="[0-9]*" // Only allow numbers
              required
            />
            <button type="submit">Search Product</button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
