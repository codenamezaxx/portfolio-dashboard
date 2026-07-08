/**
 * Portfolio Data Fetching Utilities
 * Server-side functions for fetching portfolio content from Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { queryCache, cacheKeys } from './query-cache';

// Use service role key on server-side to bypass RLS, fall back to anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Type definitions
export interface Profile {
  id?: string;
  name: string;
  role: string;
  tagline: string;
  status_label?: string;
  hero_image_url?: string;
  resume_url?: string;
  resume_url_en?: string;
  created_at?: string;
  updated_at?: string;
  name_en?: string;
  role_en?: string;
  tagline_en?: string;
  status_label_en?: string;
}

export interface TechStackItem {
  id?: string;
  name: string;
  icon: string;
  displayOrder: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JourneyItem {
  id?: string;
  year: string;
  title: string;
  description: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  title_en?: string;
  description_en?: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  technologies: string[];
  github_link?: string;
  live_link?: string;
  demo_link?: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  title_en?: string;
  description_en?: string;
}

export interface Achievement {
  id?: string;
  title: string;
  category: string;
  issuer: string;
  year: number;
  pdf_url: string;
  external_link?: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  title_en?: string;
  issuer_en?: string;
}

export interface ContactInfo {
  id?: string;
  github_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  telegram_url?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

// Locale mapping utility
function applyLocaleItem<T extends Record<string, unknown>>(item: T, locale?: string): T {
  if (locale !== 'en') return item;
  const result = { ...item } as Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r: any = result;
  if (r.name_en != null) r.name = r.name_en;
  if (r.role_en != null) r.role = r.role_en;
  if (r.tagline_en != null) r.tagline = r.tagline_en;
  if (r.status_label_en != null) r.status_label = r.status_label_en;
  if (r.resume_url_en != null) r.resume_url = r.resume_url_en;
  if (r.title_en != null) r.title = r.title_en;
  if (r.description_en != null) r.description = r.description_en;
  if (r.issuer_en != null) r.issuer = r.issuer_en;
  delete r.name_en;
  delete r.role_en;
  delete r.tagline_en;
  delete r.status_label_en;
  delete r.resume_url_en;
  delete r.title_en;
  delete r.description_en;
  delete r.issuer_en;
  return result as T;
}

// Fetch functions with error handling and caching

/**
 * Fetch profile data
 */
export async function getProfile(locale?: string): Promise<Profile | null> {
  const cacheKey = locale === 'en' ? cacheKeys.profile() + '_en' : cacheKeys.profile();
  const cached = queryCache.get<Profile | null>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    const result = (data && data.length > 0 ? applyLocaleItem(data[0], locale) : null) as Profile | null;
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Fetch all tech stack items
 */
export async function getTechStack(): Promise<TechStackItem[]> {
  const cacheKey = cacheKeys.techStack();
  const cached = queryCache.get<TechStackItem[]>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('tech_stack')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching tech stack:', error);
      return [];
    }

    const result = (data as TechStackItem[]) || [];
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching tech stack:', error);
    return [];
  }
}

/**
 * Fetch all journey items
 */
export async function getJourneyItems(locale?: string): Promise<JourneyItem[]> {
  const cacheKey = locale === 'en' ? cacheKeys.journeyItems() + '_en' : cacheKeys.journeyItems();
  const cached = queryCache.get<JourneyItem[]>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('journey_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching journey items:', error);
      return [];
    }

    let result = (data as JourneyItem[]) || [];
    if (locale === 'en' && result.length > 0) {
      result = result.map(item => applyLocaleItem(item as unknown as Record<string, unknown>, locale) as unknown as JourneyItem);
    }
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching journey items:', error);
    return [];
  }
}

/**
 * Fetch all projects
 */
export async function getProjects(locale?: string): Promise<Project[]> {
  const cacheKey = locale === 'en' ? cacheKeys.projects() + '_en' : cacheKeys.projects();
  const cached = queryCache.get<Project[]>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true});

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    let result = (data as Project[]) || [];
    if (locale === 'en' && result.length > 0) {
      result = result.map(item => applyLocaleItem(item as unknown as Record<string, unknown>, locale) as unknown as Project);
    }
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Fetch a single project by ID
 */
export async function getProjectById(id: string, locale?: string): Promise<Project | null> {
  const cacheKey = locale === 'en' ? cacheKeys.projectById(id) + '_en' : cacheKeys.projectById(id);
  const cached = queryCache.get<Project | null>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    const result = (data ? applyLocaleItem(data as unknown as Record<string, unknown>, locale) : null) as Project | null;
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

/**
 * Fetch projects by category
 */
export async function getProjectsByCategory(category: string, locale?: string): Promise<Project[]> {
  const cacheKey = locale === 'en' ? cacheKeys.projectsByCategory(category) + '_en' : cacheKeys.projectsByCategory(category);
  const cached = queryCache.get<Project[]>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects by category:', error);
      return [];
    }

    let result = (data as Project[]) || [];
    if (locale === 'en' && result.length > 0) {
      result = result.map(item => applyLocaleItem(item as unknown as Record<string, unknown>, locale) as unknown as Project);
    }
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    return [];
  }
}

/**
 * Fetch all achievements
 */
export async function getAchievements(locale?: string): Promise<Achievement[]> {
  const cacheKey = locale === 'en' ? cacheKeys.achievements() + '_en' : cacheKeys.achievements();
  const cached = queryCache.get<Achievement[]>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    let result = (data as Achievement[]) || [];
    if (locale === 'en' && result.length > 0) {
      result = result.map(item => applyLocaleItem(item as unknown as Record<string, unknown>, locale) as unknown as Achievement);
    }
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
}

/**
 * Fetch achievements by category
 */
export async function getAchievementsByCategory(category: string, locale?: string): Promise<Achievement[]> {
  const cacheKey = locale === 'en' ? cacheKeys.achievementsByCategory(category) + '_en' : cacheKeys.achievementsByCategory(category);
  const cached = queryCache.get<Achievement[]>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('category', category)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching achievements by category:', error);
      return [];
    }

    let result = (data as Achievement[]) || [];
    if (locale === 'en' && result.length > 0) {
      result = result.map(item => applyLocaleItem(item as unknown as Record<string, unknown>, locale) as unknown as Achievement);
    }
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching achievements by category:', error);
    return [];
  }
}

/**
 * Fetch contact information
 */
export async function getContactInfo(): Promise<ContactInfo | null> {
  const cacheKey = cacheKeys.contactInfo();
  const cached = queryCache.get<ContactInfo | null>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching contact info:', error);
      return null;
    }

    const result = (data && data.length > 0 ? data[0] : null) as ContactInfo | null;
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

/**
 * Get all portfolio data at once
 * Uses caching for individual queries via the underlying fetch functions
 */
export async function getAllPortfolioData(locale?: string): Promise<{
  profile: Profile | null;
  techStack: TechStackItem[];
  journey: JourneyItem[];
  projects: Project[];
  achievements: Achievement[];
  contactInfo: ContactInfo | null;
}> {
  const cacheKey = locale === 'en' ? cacheKeys.allPortfolioData() + '_en' : cacheKeys.allPortfolioData();
  const cached = queryCache.get<Awaited<ReturnType<typeof getAllPortfolioData>>>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const [profile, techStack, journey, projects, achievements, contactInfo] = await Promise.all([
      getProfile(locale),
      getTechStack(),
      getJourneyItems(locale),
      getProjects(locale),
      getAchievements(locale),
      getContactInfo()
    ]);

    const result = {
      profile,
      techStack,
      journey,
      projects,
      achievements,
      contactInfo
    };
    
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching all portfolio data:', error);
    return {
      profile: null,
      techStack: [],
      journey: [],
      projects: [],
      achievements: [],
      contactInfo: null
    };
  }
}
