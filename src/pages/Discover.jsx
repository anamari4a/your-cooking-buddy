import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// Discover page
// Lets users search TheMealDB for recipes
const Discover = () => {
    const [search, setSearch] = useState("")
    const [results, setResults] = useState([])

    // Debounce: wait 500ms after typing due to API constraints
    useEffect(() => {
        if (!search) {
            setResults([])
            return
        }


        const timeout = setTimeout(() => {
            fetchRecipes()
        }, 500)

        return () => clearTimeout(timeout)
    }, [search])


    // Fetch recipes from TheMealDB API based on the search term
    const fetchRecipes = async () => {
        try {
            const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
                search
            )}`

            const res = await fetch(url)
            const data = await res.json()

            //MealDB returns null if no results found → replace with []
            setResults(data.meals || [])
        } catch (err) {
            console.error("Error fetching recipes:", err)
        }
    }

    //Map API result to `results` state
    return (
        <div className="min-h-[60vh] px-4 py-8">
            <div className="max-w-3xl mx-auto text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Look up a new recipe you want to try!</h2>
                <p className="text-sm text-gray-600 mt-1">Or search by ingredients you want to use.</p>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-md p-4">
                    <label htmlFor="discover-search" className="sr-only">Search recipes</label>
                    <input
                        id="discover-search"
                        type="text"
                        placeholder="Search recipes or ingredients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                <div className="mt-6">
                    {search && results.length === 0 && (
                        <div className="text-center text-sm text-gray-600">No recipes found for "{search}".</div>
                    )}

                    <div className="mt-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {results.map((recipe) => (
                            <Link key={recipe.idMeal} to={`/Discover/recipe/${recipe.idMeal}`} className="group block">
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
        </div>
    )
}

export default Discover

