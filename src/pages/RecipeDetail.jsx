import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../client";

// RecipeDetail page
// Displays a recipe fetched from TheMealDB
// Shows image, category/area, ingredients list, and instructions
const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    // Fetch recipe from TheMealDB
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

                const res = await fetch(url);
                const json = await res.json();
                const data = json.meals?.[0];

                setRecipe(data);
            } catch (err) {
                console.error("Error fetching recipe details:", err);
            }
        };

        fetchRecipe();
    }, [id]);

    // Check if saved
    useEffect(() => {
        const checkIfSaved = async () => {
            const { data, error } = await supabase
                .from("saved_recipes")
                .select("id")
                .eq("recipe_id", id)
                .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
                .maybeSingle();

            if (data) setIsSaved(true);
        };

        checkIfSaved();
    }, [id]);

    if (!recipe) return <p>Loading...</p>;

    //saveRecipe ensures user is signed in then inserts a saved_recipes record
    const saveRecipe = async () => {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;

        if (!user) {
            alert("You must be logged in to save recipes.");
            return;
        }

        const { error } = await supabase.from("saved_recipes").insert({
            user_id: user.id,
            recipe_id: id,
        });

        if (!error) {
            setIsSaved(true);
        } else {
            console.error("Save failed:", error);
        }
    };

    // Extract ingredients + measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ing = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];

        if (ing && ing.trim() !== "") {
            ingredients.push(`${measure} ${ing}`);
        }
    }



    return (
        <div className="min-h-[60vh] px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-md p-6">
                    <div className="md:flex md:gap-6">
                        <div className="md:w-1/2">
                            <div className="relative rounded-md overflow-hidden">
                                <img
                                    src={recipe.strMealThumb}
                                    alt={recipe.strMeal}
                                    className="w-full h-64 md:h-72 object-cover"
                                />

                                <button
                                    onClick={saveRecipe}
                                    disabled={isSaved}
                                    className="absolute top-3 right-3 bg-white border border-gray-200 text-gray-800 px-3 py-1.5 rounded-md shadow hover:shadow-md disabled:opacity-60"
                                >
                                    {isSaved ? 'Saved' : 'Save'}
                                </button>
                            </div>

                            {recipe.strCategory || recipe.strArea ? (
                                <div className="mt-3 text-sm text-gray-600">
                                    {recipe.strCategory && <span className="mr-3">Category: {recipe.strCategory}</span>}
                                    {recipe.strArea && <span>Region: {recipe.strArea}</span>}
                                </div>
                            ) : null}
                        </div>

                        <div className="md:w-1/2 mt-4 md:mt-0">
                            <h2 className="text-2xl font-semibold text-gray-900">{recipe.strMeal}</h2>
                            <p className="text-sm text-gray-600 mt-1">{recipe.strTags}</p>

                            <div className="mt-4 grid grid-cols-1 gap-4">
                                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ingredients</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-700">
                                        {ingredients.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Instructions</h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{recipe.strInstructions}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
