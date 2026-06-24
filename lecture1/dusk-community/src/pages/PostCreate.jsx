import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PostCreate({ user }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        image_url: imageUrl || null,
        author_id: user.id
      })
      .select()
      .single()

    if (insertError) {
      setError('게시물 작성에 실패했습니다.')
      setLoading(false)
      return
    }

    navigate(`/posts/${data.id}`)
  }

  return (
    <div className="create-container">
      <Link to="/" className="back-link">&larr; 목록으로</Link>
      <h1 className="page-title" style={{ marginBottom: '2rem' }}>NEW POST</h1>

      {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">제목</label>
          <input
            className="form-input"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">이미지 URL (선택)</label>
          <input
            className="form-input"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">내용</label>
          <textarea
            className="form-textarea"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <Link to="/" className="btn-secondary">취소</Link>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? '작성 중...' : '게시하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
