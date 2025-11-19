import { useEffect, useState } from "react"
import { useParams, Navigate } from "react-router-dom"
import { supabase } from "../client"

// EditPost page
// Fetches a post the current user owns, allows editing and deleting
// Prefills the form with the post's current values
const EditPost = () => {
    const { id } = useParams() // post id from URL
    const [redirectTo, setRedirectTo] = useState(null)

    const [post, setPost] = useState(null)
    const [recipes, setRecipes] = useState([])
    const [recipeTitles, setRecipeTitles] = useState({})
    const [loading, setLoading] = useState(true)

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [selectedRecipe, setSelectedRecipe] = useState("")

    // Fetch post + user recipes
    useEffect(() => {
        const init = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                alert("You must be logged in.")
                setRedirectTo('/')
                return
            }

            //Fetch post
            const { data: postData, error: postError } = await supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .single()

            if (postError || !postData) {
                alert("Post not found.")
                setRedirectTo('/GetPosts')
                return
            }

            // security: only owner can edit
            if (postData.user_id !== user.id) {
                alert("You are not allowed to edit this post.")
                setRedirectTo('/GetPosts')
                return
            }

            setPost(postData)
            setTitle(postData.title)
            setContent(postData.content || "")
            setImageUrl(postData.image_url || "")
            setSelectedRecipe(postData.recipe_id)

            //Load user's saved recipes
            const { data: savedRecipes } = await supabase
                .from("saved_recipes")
                .select("id, recipe_id")
                .eq("user_id", user.id)

            setRecipes(savedRecipes || [])

            //Fetch recipe titles from TheMealDB
            const titleMap = {}
            for (const r of savedRecipes) {
                try {
                    const res = await fetch(
                        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${r.recipe_id}`
                    )
                    const data = await res.json()
                    titleMap[r.recipe_id] = data.meals?.[0]?.strMeal || "Unknown Recipe"
                } catch {
                    titleMap[r.recipe_id] = "Unknown Recipe"
                }
            }
            setRecipeTitles(titleMap)

            setLoading(false)
        }

        init()
    }, [id])

    // handleUpdate submits form changes to Supabase
    const handleUpdate = async (e) => {
        e.preventDefault()

        const { error } = await supabase
            .from("posts")
            .update({
                title,
                content,
                image_url: imageUrl,
                recipe_id: selectedRecipe,
            })
            .eq("id", id)

        if (error) {
            console.error(error)
            alert("Error updating post.")
        } else {
            alert("Post updated!")
            setRedirectTo('/GetPosts')
        }
    }

    const handleDelete = async () => {
        if (!confirm("Delete this post permanently?")) return

        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", id)

        if (error) {
            console.error(error)
            alert("Failed to delete post.")
        } else {
            alert("Post deleted!")
            setRedirectTo("/")
        }
    }

    if (loading) return <p className="text-center">Loading post...</p>

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />
    }

    return (
        <div className="min-h-[60vh] px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-md p-6">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-900">Edit Post</h2>
                        <p className="text-sm text-gray-600 mt-1">Update your post details below.</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 h-36"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Recipe</label>
                            <select
                                value={selectedRecipe}
                                onChange={(e) => setSelectedRecipe(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                <option value="">-- Select Recipe --</option>
                                {recipes.map((r) => (
                                    <option key={r.id} value={r.recipe_id}>
                                        {recipeTitles[r.recipe_id] || "Loading..."}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-orange-500 text-white font-medium px-4 py-2 rounded-md hover:bg-orange-600" type="submit">Save Changes</button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Delete Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditPost
