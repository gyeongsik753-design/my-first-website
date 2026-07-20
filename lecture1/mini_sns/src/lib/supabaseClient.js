import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 환경변수가 설정되지 않았습니다. ' +
      '.env 파일을 확인하세요 (.env.example 참고).'
  );
}

// 환경변수가 비어 있어도 createClient가 즉시 throw하면 앱 전체가 흰 화면으로 죽어버리므로,
// 형식만 유효한 더미 URL로 폴백합니다. 실제 요청은 어차피 실패하지만, 각 페이지에서
// try/catch로 처리되어 "게시물이 없습니다" 같은 정상적인 빈 상태로 표시됩니다.
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-anon-key');
