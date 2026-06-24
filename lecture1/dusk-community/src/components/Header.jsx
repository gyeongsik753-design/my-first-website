import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Header({ user }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">DUSK</Link>
        <nav className="header-nav">
          {user ? (
            <>
              <span className="header-user">{user.user_metadata?.name || user.email}</span>
              <Link to="/posts/new">글쓰기</Link>
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/register">회원가입</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
