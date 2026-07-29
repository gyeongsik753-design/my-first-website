import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, Avatar, TextField, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

export default function ChatRoom() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    supabase
      .from('conversations')
      .select(
        `id, user_a, user_b,
         user_a_profile:users!conversations_user_a_fkey ( id, username, avatar_url ),
         user_b_profile:users!conversations_user_b_fkey ( id, username, avatar_url )`
      )
      .eq('id', conversationId)
      .single()
      .then(({ data }) => {
        if (ignore || !data) return;
        setOtherUser(data.user_a === user.id ? data.user_b_profile : data.user_a_profile);
      });

    supabase
      .from('messages')
      .select('id, sender_id, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (ignore) return;
        if (!error) setMessages(data ?? []);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [conversationId, user.id]);

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => (prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setDraft('');
    const { error } = await supabase
      .from('messages')
      .insert({ conversation_id: Number(conversationId), sender_id: user.id, content });
    if (error) setDraft(content);
    setSending(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" onClick={() => navigate('/messages')} aria-label="뒤로가기">
            <ArrowBackIcon />
          </IconButton>
          <Avatar src={otherUser?.avatar_url || undefined} sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {otherUser?.username?.[0]?.toUpperCase() ?? '?'}
          </Avatar>
          <Typography sx={{ fontWeight: 700 }}>@{otherUser?.username ?? '대화'}</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : messages.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 8, fontSize: '0.85rem' }}>
            첫 메시지를 보내보세요.
          </Typography>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === user.id;
            return (
              <Box key={m.id} sx={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                <Box sx={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 3,
                      bgcolor: mine ? 'secondary.main' : 'background.paper',
                      color: mine ? '#fff' : 'text.primary',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.88rem', wordBreak: 'break-word' }}>{m.content}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.3 }}>
                    {formatTime(m.created_at)}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={bottomRef} />
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <TextField
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="메시지 보내기..."
          size="small"
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5, bgcolor: 'rgba(255,255,255,0.06)' } }}
        />
        <IconButton onClick={handleSend} disabled={!draft.trim() || sending} color="secondary" aria-label="보내기">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
