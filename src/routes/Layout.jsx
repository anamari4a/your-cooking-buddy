import { Outlet, Link } from "react-router-dom"

function Layout() {
    return (
        <div className="app-layout">
            <div>
                <nav className="relative bg-white shadow-sm py-3" aria-label="Main navigation">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center gap-2">
                            <Link
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 bg-white rounded-md border border-transparent shadow-sm hover:bg-gray-50 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
                                to="/">
                                Home
                            </Link>
                            <Link
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 bg-white rounded-md border border-transparent shadow-sm hover:bg-gray-50 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
                                to="/CreatePost">
                                Create Post
                            </Link>
                            <Link
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 bg-white rounded-md border border-transparent shadow-sm hover:bg-gray-50 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
                                to="/Discover">
                                Discover Recipes
                            </Link>
                            <Link
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 bg-white rounded-md border border-transparent shadow-sm hover:bg-gray-50 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
                                to="/GetSavedRecipes">
                                Your Recipes
                            </Link>
                            <Link
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 bg-white rounded-md border border-transparent shadow-sm hover:bg-gray-50 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
                                to="/SignIn">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout