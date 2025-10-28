import { $Enums } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export type User = {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  avatar_url: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  confirmed_at: Date | null;
  confirmation_sent_at: Date | null;
  invited_at: Date | null;
  last_signed_in_at: Date | null;
  is_active: boolean | null;
  is_banned: boolean | null;
  metadata: JsonValue;
  auth_provider: string | null;
  provider_user_id: string | null;
  role: $Enums.user_role | null;
  language_code: $Enums.language_code | null;
} | null;
