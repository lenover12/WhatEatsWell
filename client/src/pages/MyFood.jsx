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
        const response = await axios.get(
          "/api/v1/products/user-product-details",
          {
            withCredentials: true,
          }
        );
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
        Foods you follow
      </h1>
      <div className="container mx-auto p-1">
        <div className="flex flex-wrap -m-2">
          {foods.map((food) => (
            <div
              className="p-3 w-full sm:w-2/3 md:w-5/12 lg:w-1/3"
              key={food._id}
            >
              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <img
                    src={food.image_url}
                    alt={food.food_name}
                    className="w-full rounded-t-lg p-1.5"
                  />
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      <strong>{food.food_name}</strong>
                    </h5>
                  </a>
                  <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {food.ingredients_tags && (
                      <IngredientsTable ingredients={food.ingredients_tags} />
                    )}
                    {food.allergens_tags && (
                      <AllergensTable allergens={food.allergens_tags} />
                    )}
                    {food.nutriments && (
                      <NutrientTable nutriments={food.nutriments} />
                    )}
                  </div>
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
                          My serving size:{" "}
                          {food.user_information.my_serving_size}
                        </p>
                      )}
                    </div>
                  )}
                  <a
                    href="#"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Read more
                    <svg
                      className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IngredientsTable({ ingredients }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="border border-gray-300 shadow-sm rounded-lg overflow-hidden">
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-gray-100 cursor-pointer relative"
      >
        <table className="w-full text-sm leading-5">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">
                Ingredients
              </th>
            </tr>
          </thead>
        </table>
        {isCollapsed && (
          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white dark:from-gray-800" />
        )}
      </div>
      {!isCollapsed && (
        <table className="w-full text-sm leading-5">
          <tbody>
            {ingredients.map((ingredient, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-1.5 px-4 text-left">{ingredient}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AllergensTable({ allergens }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="border border-gray-300 shadow-sm rounded-lg overflow-hidden">
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-gray-100 cursor-pointer relative"
      >
        <table className="w-full text-sm leading-5">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">
                Allergens
              </th>
            </tr>
          </thead>
        </table>
        {isCollapsed && (
          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white dark:from-gray-800" />
        )}
      </div>
      {!isCollapsed && (
        <table className="w-full text-sm leading-5">
          <tbody>
            {allergens.map((allergen, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-1.5 px-4 text-left">{allergen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function NutrientTable({ nutriments }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="border border-gray-300 shadow-sm rounded-lg overflow-hidden">
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-gray-100 cursor-pointer relative"
      >
        <table className="w-full text-sm leading-5">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">
                Nutrient
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">
                per 100g
              </th>
            </tr>
          </thead>
        </table>
        {isCollapsed && (
          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white dark:from-gray-800" />
        )}
      </div>
      {!isCollapsed && (
        <table className="w-full text-sm leading-5">
          <tbody>
            {Object.keys(nutriments).map((key, index) => (
              <tr key={key} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-1.5 px-4 text-left font-medium text-gray-600">
                  {key}
                </td>
                <td className="py-1.5 px-4 text-left">{nutriments[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
