import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const formatRelative = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return '방금';
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  return `${Math.floor(hour / 24)}일 전`;
};

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [startingWith, setStartingWith] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    supabase
      .from('conversations')
      .select(
        `id, last_message_at, user_a, user_b,
         user_a_profile:users!conversations_user_a_fkey ( id, username, avatar_url ),
         user_b_profile:users!conversations_user_b_fkey ( id, username, avatar_url )`
      )
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
      .order('last_message_at', { ascending: false })
      .then(async ({ data, error }) => {
        if (ignore || error || !data) {
          setLoading(false);
          return;
        }

        const ids = data.map((c) => c.id);
        const { data: lastMessages } = ids.length
          ? await supabase
              .from('messages')
              .select('conversation_id, content, created_at')
              .in('conversation_id', ids)
              .order('created_at', { ascending: false })
          : { data: [] };

        const previewByConversation = new Map();
        (lastMessages ?? []).forEach((m) => {
          if (!previewByConversation.has(m.conversation_id)) {
            previewByConversation.set(m.conversation_id, m);
          }
        });

        if (ignore) return;
        setConversations(
          data.map((c) => ({
            ...c,
            otherUser: c.user_a === user.id ? c.user_b_profile : c.user_a_profile,
            preview: previewByConversation.get(c.id) ?? null,
          }))
        );
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [user.id]);

  useEffect(() => {
    const q = search.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    let ignore = false;
    setSearching(true);
    const timer = setTimeout(() => {
      supabase
        .from('users')
        .select('id, username, avatar_url')
        .neq('id', user.id)
        .ilike('username', `%${q}%`)
        .limit(10)
        .then(({ data }) => {
          if (!ignore) setSearchResults(data ?? []);
          setSearching(false);
        });
    }, 300);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search, user.id]);

  const handleStartConversation = async (otherUserId) => {
    setStartingWith(otherUserId);
    const { data, error } = await supabase.rpc('get_or_create_conversation', {
      other_user_id: otherUserId,
    });
    setStartingWith(null);
    if (!error && data) navigate(`/messages/${data}`);
  };

  return (
    <Box sx={{ pb: 2 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', py: 1, gap: 1 }}>
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>메시지</Typography>
          <TextField
            placeholder="사용자명으로 새 대화 시작"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(0,0,0,0.04)' } }}
          />
        </Toolbar>
      </AppBar>

      {search.trim() ? (
        <Box sx={{ px: 2, pt: 1.5 }}>
          {searching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={22} color="secondary" />
            </Box>
          ) : searchResults.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 4, fontSize: '0.85rem' }}>
              일치하는 사용자가 없습니다.
            </Typography>
          ) : (
            searchResults.map((u) => (
              <Box
                key={u.id}
                onClick={() => handleStartConversation(u.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.2,
                  cursor: 'pointer',
                  opacity: startingWith === u.id ? 0.6 : 1,
                }}
              >
                <Avatar src={u.avatar_url || undefined} sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                  {u.username?.[0]?.toUpperCase() ?? '?'}
                </Avatar>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>@{u.username}</Typography>
              </Box>
            ))
          )}
        </Box>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : conversations.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 8, fontSize: '0.9rem' }}>
          아직 대화가 없습니다. 사용자명을 검색해서 첫 메시지를 보내보세요.
        </Typography>
      ) : (
        <Box>
          {conversations.map((c) => (
            <Box
              key={c.id}
              onClick={() => navigate(`/messages/${c.id}`)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                cursor: 'pointer',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Avatar
                src={c.otherUser?.avatar_url || undefined}
                sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
              >
                {c.otherUser?.username?.[0]?.toUpperCase() ?? '?'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
                  @{c.otherUser?.username ?? '알 수 없음'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {c.preview?.content ?? '대화를 시작해보세요'}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', flexShrink: 0 }}>
                {formatRelative(c.last_message_at)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
