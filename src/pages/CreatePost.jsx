import { useEffect, useState } from "react"
import { supabase } from "../client"

// CreatePost page
// Lets a logged-in user create a post tied to a saved recipe
// Loads the user's saved recipes to choose from
const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [recipes, setRecipes] = useState([]) // [{recipe_id, title}]
    const [selectedRecipe, setSelectedRecipe] = useState("")
    const [loading, setLoading] = useState(true)

    // Load user's saved recipes, then fetch titles from TheMealDB
    useEffect(() => {
        const fetchSavedRecipes = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                setLoading(false)
                return
            }

            //Get saved recipe IDs from Supabase
            const { data: saved, error } = await supabase
                .from("saved_recipes")
                .select("recipe_id")
                .eq("user_id", user.id)

            if (error) {
                console.error(error)
                setLoading(false)
                return
            }

            //Fetch recipe titles from TheMealDB
            const recipeList = []

            for (const item of saved) {
                const res = await fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item.recipe_id}`
                )
                const json = await res.json()

                if (json.meals && json.meals[0]) {
                    recipeList.push({
                        recipe_id: item.recipe_id,
                        title: json.meals[0].strMeal,
                    })
                }
            }

            setRecipes(recipeList)
            setLoading(false)
        }

        fetchSavedRecipes()
    }, [])

    // handleSubmit inserts a new post tied to the current user
    const handleSubmit = async (event) => {
        event.preventDefault()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) return alert("You must be logged in to create a post.")
        if (!selectedRecipe) return alert("Please choose a recipe for this post.")

        const { error } = await supabase.from("posts").insert({
            title,
            content,
            image_url: imageUrl || null,
            recipe_id: selectedRecipe,
            user_id: user.id,
        })

        if (error) {
            console.error(error)
            alert("Error creating post")
        } else {
            alert("Post created!")
        }
    }

    if (loading) return <p className="text-center">Loading recipes...</p>

    return (
        <div className="min-h-[60vh] px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Create a New Post</h2>
                    <p className="text-sm text-gray-600 mt-1">Share your thoughts about a saved recipe.</p>
                </div>

                {recipes.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-md p-6 text-center">
                        <p>You must save at least one recipe before creating a post.</p>
                    </div>
                ) : (
                    <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-md p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title (required)</label>
                                <input
                                    type="text"
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Additional Content (optional)</label>
                                <textarea
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 h-28"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select a Saved Recipe</label>
                                <select
                                    value={selectedRecipe}
                                    onChange={(e) => setSelectedRecipe(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                >
                                    <option value="">-- Choose a recipe --</option>
                                    {recipes.map((r) => (
                                        <option key={r.recipe_id} value={r.recipe_id}>
                                            {r.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-2">
                                <button className="w-full bg-orange-500 text-white font-medium px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-60" type="submit">Create Post</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreatePost
