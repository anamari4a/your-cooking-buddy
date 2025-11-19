import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../client"

// PostDetail page
// Shows a single post with content, image, upvotes and comments
// Owner can edit/delete; logged-in users can comment and upvote
const PostDetail = () => {
    const { id } = useParams()

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [user, setUser] = useState(null)

    // Load auth user
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })
    }, [])

    // Fetch post + comments
    useEffect(() => {
        const loadPost = async () => {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .single()

            if (!error) setPost(data)
        }

        const loadComments = async () => {
            const { data } = await supabase
                .from("comments")
                .select("*")
                .eq("post_id", id)
                .order("created_at", { ascending: true })

            setComments(data || [])
        }

        loadPost()
        loadComments()
    }, [id])

    if (!post) return <p>Loading post...</p>

    // Increase the post's upvote count by 1
    const handleUpvote = async () => {
        const { data, error } = await supabase
            .from("posts")
            .update({ upvotes: post.upvotes + 1 })
            .eq("id", id)
            .select()
            .single()

        if (!error) setPost(data)
    }

    // Insert a new comment for this post and update local state
    const addComment = async () => {
        if (!user) return alert("You must be logged in to comment.")
        if (!newComment.trim()) return

        const { data, error } = await supabase
            .from("comments")
            .insert({
                post_id: id,
                user_id: user.id,
                content: newComment,
            })
            .select()

        if (!error) {
            setComments((prev) => [...prev, data[0]])
            setNewComment("")
        }
    }


    const isOwner = user?.id === post.user_id

    return (
        <div className="min-h-[60vh] px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-md p-6">
                    <div className="space-y-4">
                        <div className="relative">
                            {post.image_url ? (
                                <div className="w-full rounded-md overflow-hidden">
                                    <img src={post.image_url} alt={post.title} className="w-full h-64 object-cover rounded-md" />
                                </div>
                            ) : (
                                <div className="w-full h-40 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">No image</div>
                            )}

                            <div className="absolute top-3 right-3 flex gap-2">
                                <button
                                    onClick={handleUpvote}
                                    className="bg-white border border-gray-200 text-gray-800 px-3 py-1.5 rounded-md shadow hover:shadow-md"
                                    title="Upvote"
                                >
                                    👍 {post.upvotes}
                                </button>

                                {isOwner && (
                                    <Link to={`/posts/${id}/EditPost`}>
                                        <button className="bg-white border border-gray-200 text-gray-800 px-3 py-1.5 rounded-md shadow hover:shadow-md" title="Edit post">✏️ Edit</button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">{post.title}</h2>
                            <p className="text-sm text-gray-600 mt-1">🕒 Posted on: {new Date(post.created_at).toLocaleString()}</p>
                            <p className="mt-3 text-gray-800">{post.content}</p>

                            {post.recipe_id && (
                                <p className="mt-3 text-sm">
                                    Linked Recipe: <Link to={`/Discover/recipe/${post.recipe_id}`} className="text-orange-500">View Recipe</Link>
                                </p>
                            )}
                        </div>

                        <div className="mt-2">
                            <hr className="border-gray-100" />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Comments</h3>

                            {comments.length === 0 ? (
                                <p className="text-sm text-gray-600 mt-2">No comments yet.</p>
                            ) : (
                                <div className="mt-3 space-y-3">
                                    {comments.map((c) => (
                                        <div key={c.id} className="bg-white border border-gray-100 rounded-md p-3">
                                            <p className="text-sm text-gray-800">{c.content}</p>
                                            <div className="text-xs text-gray-500 mt-1">{new Date(c.created_at).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {user ? (
                                <div className="mt-4">
                                    <label className="sr-only">Write a comment</label>
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full border rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />
                                    <div className="mt-2 text-right">
                                        <button onClick={addComment} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Add Comment</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 mt-3">You must be logged in to comment.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetail
