import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/user.context";
import axios from "axios";

export default function MyFood() {
  const { user, fetchUserProfile } = useContext(UserContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserFoods = async () => {
      try {
        const response = await axios.get("/api/v1/products/user-product-details", {
          withCredentials: true,
        });
        setFoods(response.data.products);
      } catch (error) {
        console.error("Error fetching user foods:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserFoods();
    } else {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  //conditional rendering while retrieving database data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Foods you follow</h1>
      {foods.map((food) => (
        <div key={food._id} style={{ display: "flex", marginBottom: "20px" }}>
          <img
            src={food.image_url}
            alt={food.food_name}
            style={{ width: "200px", height: "200px", marginRight: "20px" }}
          />
          <div>
            <p><strong>{food.food_name}</strong></p>
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
                <p><strong>User Information:</strong></p>
                {food.user_information.added_at && (
                  <p>Added on: {new Date(food.user_information.added_at).toLocaleString()}</p>
                )}
                {food.user_information.in_list && (
                  <p>In list: {food.user_information.in_list}</p>
                )}
                {food.user_information.my_serving_size && (
                  <p>My serving size: {food.user_information.my_serving_size}</p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
