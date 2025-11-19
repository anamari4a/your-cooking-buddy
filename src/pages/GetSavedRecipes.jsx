import { useEffect, useState } from "react";
import { supabase } from "../client";
import { Link } from "react-router-dom";

// GetSavedRecipes page
// Loads recipes the user has saved and shows them in a grid
const GetSavedRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSavedRecipes = async () => {
            setLoading(true);

            // Get logged-in user
            const { data: authData } = await supabase.auth.getUser();
            const user = authData.user;

            if (!user) {
                setRecipes([]);
                setLoading(false);
                return;
            }

            // Get saved recipes from Supabase
            const { data: saved, error } = await supabase
                .from("saved_recipes")
                .select("recipe_id")
                .eq("user_id", user.id);

            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            // Fetch recipes from TheMealDB
            const fetchedRecipes = [];

            for (const r of saved) {
                const res = await fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${r.recipe_id}`
                );
                const json = await res.json();
                const recipe = json.meals?.[0];

                if (recipe) fetchedRecipes.push(recipe);
            }

            setRecipes(fetchedRecipes);
            setLoading(false);
        };

        loadSavedRecipes();
    }, []);

    if (loading) return <p className="text-center">Loading saved recipes...</p>;

    if (recipes.length === 0)
        return <p className="text-center">You have no saved recipes yet!</p>;

    return (
        <div className="min-h-[60vh] px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Your Saved Recipes</h2>
                    <p className="text-sm text-gray-600 mt-1">Recipes you've saved for later</p>
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {recipes.map((recipe) => (
                        <Link
                            key={recipe.idMeal}
                            to={`/Discover/recipe/${recipe.idMeal}`}
                            className="group block"
                        >
                            <div className="bg-white/90 border border-gray-100 rounded-xl shadow p-3 hover:shadow-lg transition">
                                {recipe.strMealThumb && (
                                    <div className="h-40 w-full rounded-md overflow-hidden mb-3 bg-gray-50">
                                        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <h4 className="text-lg font-semibold text-gray-900 truncate">{recipe.strMeal}</h4>
                                {recipe.strCategory && <p className="text-xs text-gray-500 mt-1">{recipe.strCategory}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GetSavedRecipes;
