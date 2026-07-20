import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // 개발 중 환경변수를 깜빡했을 때 바로 알아챌 수 있도록 콘솔에 안내
  console.warn(
    '[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 환경변수가 설정되지 않았습니다. ' +
      '.env 파일을 확인하세요 (.env.example 참고).'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
