import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import PostCreate from './pages/PostCreate'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">DUSK</div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header user={user} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PostList user={user} />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/posts/new" element={user ? <PostCreate user={user} /> : <Navigate to="/login" />} />
          <Route path="/posts/:id" element={<PostDetail user={user} />} />
        </Routes>
      </main>
      <footer className="footer">
        <span>&copy; 2026 DUSK. All rights reserved.</span>
      </footer>
    </div>
  )
}
