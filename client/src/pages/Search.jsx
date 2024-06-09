import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/user.context";
import axios from "axios";
// import Spinner from "../Spinner";

export default function Search() {
  const { user, fetchUserProfile } = useContext(UserContext);
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `/api/v1/products/search?query=${searchTerm}`,
        {
          withCredentials: true,
        }
      );
      setFoods(response.data.products);
    } catch (error) {
      console.error("Error fetching user foods:", error);
      // Set appropriate error message
      if (error.response && error.response.status === 429) {
        setError("Rate limit reached. Please try again later.");
      } else {
        setError("An error occurred while fetching products.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const addFoodToDatabase = async (food) => {
    try {
      const { _id, ...foodData } = food;
      await axios.post(
        "/api/v1/products/add",
        { productId: _id, ...foodData },
        {
          withCredentials: true,
        }
      );
      alert("Food added successfully!");
    } catch (error) {
      console.error("Error adding food to database:", error);
      alert("Failed to add food.");
    }
  };

  //conditional rendering while retrieving database data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="searchTerm">Search Product:</label>
          <input
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={searchTerm}
            onChange={handleSearchTermChange}
            required
          />
          <button type="submit">Search Product</button>
        </form>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
      </div>
      {foods.length > 0 && (
        <div>
          {foods.map((food) => (
            <div
              key={food._id}
              style={{ display: "flex", marginBottom: "20px" }}
            >
              <img
                src={food.image_url}
                alt={food.food_name}
                style={{ width: "200px", height: "200px", marginRight: "20px" }}
              />
              <div>
                <p>
                  <strong>{food.food_name}</strong>
                </p>
                {food.ingredients_tags && (
                  <p>Ingredients: {food.ingredients_tags.join(", ")}</p>
                )}
                {food.allergens_tags && (
                  <p>Allergens: {food.allergens_tags.join(", ")}</p>
                )}
                {food.nutriments && (
                  <div>
                    <p>Nutriments:</p>
                    <pre>{JSON.stringify(food.nutriments, null, 2)}</pre>
                  </div>
                )}
                {food.user_information && (
                  <div>
                    <p>
                      <strong>User Information:</strong>
                    </p>
                    {food.user_information.added_at && (
                      <p>
                        Added on:{" "}
                        {new Date(
                          food.user_information.added_at
                        ).toLocaleString()}
                      </p>
                    )}
                    {food.user_information.in_list && (
                      <p>In list: {food.user_information.in_list}</p>
                    )}
                    {food.user_information.my_serving_size && (
                      <p>
                        My serving size: {food.user_information.my_serving_size}
                      </p>
                    )}
                  </div>
                )}
                <button onClick={() => addFoodToDatabase(food)}>Add</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
