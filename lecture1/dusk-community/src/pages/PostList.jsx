import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Pagination from '../components/Pagination'

const POSTS_PER_PAGE = 10

export default function PostList({ user }) {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [currentPage])

  const fetchPosts = async () => {
    setLoading(true)
    const from = (currentPage - 1) * POSTS_PER_PAGE
    const to = from + POSTS_PER_PAGE - 1

    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })

    setTotalCount(count || 0)

    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles!posts_author_profile_fkey(name)')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error || !data) {
      setPosts([])
      setLoading(false)
      return
    }

    const postIds = data.map(p => p.id)

    if (postIds.length > 0) {
      const [commentsRes, likesRes] = await Promise.all([
        supabase.from('comments').select('post_id').in('post_id', postIds),
        supabase.from('likes').select('post_id').in('post_id', postIds)
      ])

      const commentCounts = {}
      const likeCounts = {}
      ;(commentsRes.data || []).forEach(c => {
        commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1
      })
      ;(likesRes.data || []).forEach(l => {
        likeCounts[l.post_id] = (likeCounts[l.post_id] || 0) + 1
      })

      setPosts(data.map(post => ({
        ...post,
        comment_count: commentCounts[post.id] || 0,
        like_count: likeCounts[post.id] || 0
      })))
    } else {
      setPosts([])
    }

    setLoading(false)
  }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">POSTS</h1>
        {user && (
          <Link to="/posts/new" className="btn-secondary">
            새 글 작성
          </Link>
        )}
      </div>

      {loading ? (
        <div className="post-empty">
          <p>로딩 중...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="post-empty">
          <p>아직 게시물이 없습니다.</p>
          {user && (
            <Link to="/posts/new" className="btn-primary">
              첫 번째 글 작성하기
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="post-list">
            {posts.map(post => (
              <Link to={`/posts/${post.id}`} key={post.id} className="post-item">
                {post.image_url ? (
                  <img src={post.image_url} alt="" className="post-thumbnail" />
                ) : (
                  <div className="post-thumbnail-placeholder">D</div>
                )}
                <div className="post-info">
                  <div className="post-title">{post.title}</div>
                  <div className="post-meta">
                    <span>{post.profiles?.name || '알 수 없음'}</span>
                    <span className="post-date">{formatDate(post.created_at)}</span>
                    <span>댓글 {post.comment_count}</span>
                    <span>♥ {post.like_count}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}
