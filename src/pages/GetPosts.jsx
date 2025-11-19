import { useEffect, useState } from "react"
import { supabase } from "../client"
import { Link } from "react-router-dom"

// GetPosts page
// Loads posts from Supabase with optional search and sorting
// Displays posts in a grid
const GetPosts = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState("created_at") // default
    const [search, setSearch] = useState("")
    const [searchInput, setSearchInput] = useState("")  // user typing


    useEffect(() => {
        fetchPosts()
    }, [sortBy, search])

    const fetchPosts = async () => {
        setLoading(true)

        //Base query
        let query = supabase
            .from("posts")
            .select("id, title, upvotes, created_at, image_url")

        //Search filter
        if (search.trim() !== "") {
            query = query.ilike("title", `%${search}%`)
        }

        //Sorting logic
        if (sortBy === "upvotes") {
            query = query.order("upvotes", { ascending: false })
        } else {
            query = query.order("created_at", { ascending: false })
        }

        const { data, error } = await query

        if (!error) setPosts(data)
        setLoading(false)
    }

    if (loading) return <p>Loading posts...</p>

    return (
        <div className="min-h-[60vh] px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Community Posts</h2>
                    <p className="text-sm text-gray-600 mt-1">Explore what the community is sharing.</p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-md p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3 justify-between">
                        <div className="flex-1 min-w-[180px]">
                            <label htmlFor="posts-search" className="sr-only">Search posts</label>
                            <input
                                id="posts-search"
                                type="text"
                                placeholder="Search posts by title"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setSearch(searchInput); // Only trigger actual search now
                                    }
                                }}
                                className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-2 py-1 text-sm border rounded-md"
                            >
                                <option value="created_at">Newest</option>
                                <option value="upvotes">Most Upvoted</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    {posts.length === 0 ? (
                        <p className="text-center text-gray-600">No posts found.</p>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {posts.map((post) => (
                                <Link key={post.id} to={`/PostDetail/posts/${post.id}`} className="block">
                                    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1">
                                        {post.image_url ? (
                                            <img src={post.image_url} alt={post.title} className="w-full h-40 object-cover" />
                                        ) : (
                                            <div className="w-full h-40 bg-gray-50 flex items-center justify-center text-gray-400">No image</div>
                                        )}

                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                                            <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                                                <span>⭐ {post.upvotes ?? 0}</span>
                                                <span>•</span>
                                                <time>{new Date(post.created_at).toLocaleString()}</time>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GetPosts
