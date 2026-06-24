import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PostDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles!comments_author_profile_fkey(name)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    setComments(data || [])
  }, [id])

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles!posts_author_profile_fkey(name)')
        .eq('id', id)
        .single()

      if (error || !data) {
        navigate('/')
        return
      }

      setPost(data)
      setLoading(false)

      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', id)

      setLikeCount(count || 0)

      await supabase.rpc('increment_view_count', { p_post_id: parseInt(id) })
    }

    load()
    fetchComments()
  }, [id, navigate, fetchComments])

  useEffect(() => {
    if (!user) return
    const checkLiked = async () => {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle()

      setLiked(!!data)
    }
    checkLiked()
  }, [id, user])

  const handleLike = async () => {
    if (!user) return

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', user.id)
      setLiked(false)
      setLikeCount(prev => prev - 1)
    } else {
      await supabase
        .from('likes')
        .insert({ post_id: parseInt(id), user_id: user.id })
      setLiked(true)
      setLikeCount(prev => prev + 1)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || !user) return
    setSubmitting(true)

    const { error } = await supabase
      .from('comments')
      .insert({
        content: commentText.trim(),
        post_id: parseInt(id),
        author_id: user.id
      })

    if (!error) {
      setCommentText('')
      fetchComments()
    }
    setSubmitting(false)
  }

  const handleDeleteComment = async (commentId) => {
    await supabase.from('comments').delete().eq('id', commentId)
    fetchComments()
  }

  const handleDeletePost = async () => {
    if (!confirm('게시물을 삭제하시겠습니까?')) return
    await supabase.from('posts').delete().eq('id', id)
    navigate('/')
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="post-empty"><p>로딩 중...</p></div>
  }

  if (!post) return null

  return (
    <div className="post-detail">
      <Link to="/" className="back-link">&larr; 목록으로</Link>

      <div className="post-detail-header">
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span>{post.profiles?.name || '알 수 없음'}</span>
          <span>{formatDate(post.created_at)}</span>
          <span>조회 {post.view_count}</span>
          {user && user.id === post.author_id && (
            <button className="comment-delete" onClick={handleDeletePost}>삭제</button>
          )}
        </div>
      </div>

      {post.image_url && (
        <img src={post.image_url} alt="" className="post-detail-image" />
      )}

      <div className="post-detail-content">{post.content}</div>

      <div className="post-actions">
        <button
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={!user}
        >
          {liked ? '♥' : '♡'} {likeCount}
        </button>
        <span className="stat-item">댓글 {comments.length}</span>
        <span className="stat-item">조회 {post.view_count}</span>
      </div>

      <div className="comments-section">
        <h3 className="comments-title">COMMENTS ({comments.length})</h3>

        {user ? (
          <form className="comment-form" onSubmit={handleComment}>
            <input
              className="comment-input"
              type="text"
              placeholder="댓글을 입력하세요"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <button className="comment-submit" type="submit" disabled={submitting}>
              등록
            </button>
          </form>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <Link to="/login" style={{ borderBottom: '1px solid var(--border)' }}>로그인</Link> 후 댓글을 작성할 수 있습니다.
          </p>
        )}

        <div className="comment-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div>
                  <span className="comment-author">{comment.profiles?.name || '알 수 없음'}</span>
                  <span className="comment-date" style={{ marginLeft: '0.8rem' }}>
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                {user && user.id === comment.author_id && (
                  <button
                    className="comment-delete"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className="comment-body">{comment.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
