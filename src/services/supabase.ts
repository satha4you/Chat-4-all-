import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

// Supabase configuration
// Credentials provided for project: fbmoawvxwqgzbeatwmcu
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;

export const SUPABASE_URL =
  metaEnv?.VITE_SUPABASE_URL || 'https://fbmoawvxwqgzbeatwmcu.supabase.co';
export const SUPABASE_ANON_KEY =
  metaEnv?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_s-y-6qawxslwoqqm0rfizw_evr_bkxe';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Interface representing a user profile record in Supabase Database ('profiles' table)
 */
export interface SupabaseProfileRow {
  id: string;
  user_id?: string;
  email?: string;
  username: string;
  nickname: string;
  avatar: string;
  role: 'owner' | 'admin' | 'moderator' | 'vip' | 'user';
  vip_tier: string;
  is_vip_active: boolean;
  vip_expires_at?: string | null;
  country: {
    code: string;
    nameAr: string;
    nameEn: string;
    flag: string;
  };
  level: number;
  xp: number;
  coins: number;
  bio?: string;
  status?: string;
  passcode?: string;
  verified: boolean;
  verification_type?: 'blue' | 'gold' | null;
  followers_count?: number;
  following_count?: number;
  joined_date?: string;
  received_gifts_count?: number;
  total_gifts_value?: number;
  updated_at?: string;
}

/**
 * Convert local UserProfile to Supabase DB Row
 */
export function userProfileToSupabaseRow(profile: UserProfile): SupabaseProfileRow {
  return {
    id: profile.id,
    email: profile.email,
    username: profile.username || `user_${profile.id.slice(-6)}`,
    nickname: profile.nickname || 'عضو ديوان VIP',
    avatar: profile.avatar || '/assets/owner_avatar.jpg',
    role: profile.role || 'user',
    vip_tier: profile.vipTier || 'none',
    is_vip_active: !!profile.isVipActive,
    vip_expires_at: profile.vipExpiresAt || null,
    country: profile.country || {
      code: 'SA',
      nameAr: 'المملكة العربية السعودية',
      nameEn: 'Saudi Arabia',
      flag: '🇸🇦',
    },
    level: profile.level || 1,
    xp: profile.xp || 100,
    coins: profile.coins ?? 10000,
    bio: profile.bio || '',
    status: profile.status || 'متصل الآن 🟢',
    passcode: profile.passcode || '123456',
    verified: !!profile.verified,
    verification_type: profile.verificationType || null,
    followers_count: profile.followersCount || 0,
    following_count: profile.followingCount || 0,
    joined_date: profile.joinedDate || new Date().toISOString().split('T')[0],
    received_gifts_count: profile.receivedGiftsCount || 0,
    total_gifts_value: profile.totalGiftsValue || 0,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Convert Supabase DB Row back to local UserProfile
 */
export function supabaseRowToUserProfile(row: any): UserProfile {
  return {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    email: row.email,
    passcode: row.passcode || '123456',
    avatar: row.avatar,
    role: row.role || 'user',
    vipTier: row.vip_tier || 'none',
    isVipActive: !!row.is_vip_active,
    vipExpiresAt: row.vip_expires_at || undefined,
    country: row.country || {
      code: 'SA',
      nameAr: 'المملكة العربية السعودية',
      nameEn: 'SA',
      flag: '🇸🇦',
    },
    level: row.level || 1,
    xp: row.xp || 100,
    coins: row.coins ?? 10000,
    bio: row.bio || '',
    status: row.status || 'متصل الآن 🟢',
    verified: !!row.verified,
    verificationType: row.verification_type || undefined,
    followersCount: row.followers_count || 0,
    followingCount: row.following_count || 0,
    joinedDate: row.joined_date || new Date().toISOString().split('T')[0],
    receivedGiftsCount: row.received_gifts_count || 0,
    totalGiftsValue: row.total_gifts_value || 0,
    badges: [],
  };
}

/**
 * Supabase Auth: Sign In with Email & Password
 */
export async function supabaseSignInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Supabase Auth: Sign Up with Email & Password
 */
export async function supabaseSignUpWithEmail(
  email: string,
  password: string,
  metadata?: { nickname?: string; countryCode?: string }
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        data: metadata || {},
      },
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Supabase Auth: Sign Out
 */
export async function supabaseSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Supabase DB: Save / Upsert user profile to 'profiles' table
 */
export async function saveProfileToSupabase(profile: UserProfile): Promise<{ success: boolean; error?: any }> {
  try {
    const row = userProfileToSupabaseRow(profile);
    const { error } = await supabase.from('profiles').upsert(row, {
      onConflict: 'id',
    });

    if (error) {
      console.warn('[Supabase] Warning saving profile to profiles table:', error.message);
      return { success: false, error };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] Exception saving profile:', err);
    return { success: false, error: err };
  }
}

/**
 * Supabase DB: Fetch single profile by ID or Email
 */
export async function fetchProfileFromSupabase(identifier: string): Promise<UserProfile | null> {
  try {
    const isEmail = identifier.includes('@');
    const query = supabase.from('profiles').select('*');

    const { data, error } = isEmail
      ? await query.ilike('email', identifier.trim().toLowerCase()).maybeSingle()
      : await query.eq('id', identifier).maybeSingle();

    if (error || !data) {
      return null;
    }

    return supabaseRowToUserProfile(data);
  } catch (err) {
    console.warn('[Supabase] Error fetching profile:', err);
    return null;
  }
}

/**
 * Supabase DB: Fetch all profiles
 */
export async function fetchAllProfilesFromSupabase(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('level', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map(supabaseRowToUserProfile);
  } catch (err) {
    console.warn('[Supabase] Error fetching all profiles:', err);
    return [];
  }
}
