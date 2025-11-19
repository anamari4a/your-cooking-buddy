import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Layout from './routes/Layout.jsx'
import CreatePost from './pages/CreatePost.jsx'
import Discover from './pages/Discover.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import SignIn from './pages/SignIn.jsx'
import GetSavedRecipes from './pages/GetSavedRecipes.jsx'
import GetPosts from './pages/GetPosts.jsx'
import PostDetail from './pages/PostDetail.jsx'
import EditPost from './pages/EditPost.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/CreatePost" element={<CreatePost />} />
          <Route path="/Discover" element={<Discover />} />
          <Route path="/Discover/recipe/:id" element={<RecipeDetail />} />
          <Route path="/GetSavedRecipes" element={<GetSavedRecipes />} />
          <Route path="/GetPosts" element={<GetPosts />} />
          <Route path="/PostDetail/posts/:id" element={<PostDetail />} />
          <Route path="/posts/:id/EditPost" element={<EditPost />} />
        </Route>
      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
