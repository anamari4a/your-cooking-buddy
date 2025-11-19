import { useState, useEffect } from 'react'
import { supabase } from '../client'

// SignIn page
// Provides sign up / sign in / sign out
const SignIn = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);

    // Create a new user account with email & password
    const handleSignUp = async () => {
        setError("");
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({ email, password });
        setLoading(false);

        if (error) return setError(error.message)

        setUser(data.user ?? null)
    }


    // Sign the user in with email & password
    const handleLogin = async () => {
        setError("");
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) return setError(error.message)

        setUser(data.user ?? null)
    }

    // Sign the user out
    const handleLogOut = async () => {
        setError("");
        setLoading(true);
        const { data, error } = await supabase.auth.signOut({ email, password });
        setLoading(false);
        if (error) return setError(error.message);
        setUser(data.user ?? null);
    }

    // keep session + react to changes
    useEffect(() => {

        const init = async () => {
            // 1. Get the current session from Supabase
            const { data: { session } } = await supabase.auth.getSession();
            // 2. If a user is logged in, setUser updates the state with user data, else null
            setUser(session?.user ?? null);
        };

        init();

        // 3. Listen to authentication state changes (login, logout, refresh)
        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                // 4. Update the user state whenever auth changes
                setUser(session?.user ?? null);
            });

        // 5. Cleanup: unsubscribe when component unmounts
        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            {!user ? (
                <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">Sign In</h2>

                    {error && (
                        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-2">{error}</div>
                    )}

                    <div className="space-y-3">
                        <label className="block text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        />

                        <label className="block text-sm text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        />
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            className="flex-1 bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-60"
                            onClick={handleLogin}
                            disabled={loading || !email || !password}
                        >
                            {loading ? 'Please wait...' : 'Login'}
                        </button>

                        <button
                            className="flex-1 bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-60"
                            onClick={handleSignUp}
                            disabled={loading || !email || !password}
                        >
                            Sign Up
                        </button>
                    </div>

                </div>
            ) : (
                <div className="w-full max-w-md bg-white/90 border border-gray-100 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900">Welcome, {user.email}</h2>
                    <p className="text-sm text-gray-600 mt-2">You are signed in.</p>
                    <div className="mt-4">
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-60"
                            onClick={handleLogOut}
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : 'Log out'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default SignIn 