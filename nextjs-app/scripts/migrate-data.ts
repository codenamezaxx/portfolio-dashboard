/**
 * Data Migration Script
 * Migrates static portfolio data from portfolio.ts to Supabase
 * 
 * Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/migrate-data.ts
 * Or: npx ts-node scripts/migrate-data.ts (if .env.local is loaded)
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get environment variables
// Try to load from process.env first (set via command line or .env.local)
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// If not found, try to read from .env.local file directly
if (!supabaseUrl || !supabaseKey) {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const envLines = envContent.split('\n');
      
      envLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          if (trimmedLine.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
            supabaseUrl = trimmedLine.substring('NEXT_PUBLIC_SUPABASE_URL='.length).trim();
          }
          if (trimmedLine.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
            supabaseKey = trimmedLine.substring('SUPABASE_SERVICE_ROLE_KEY='.length).trim();
          }
        }
      });
    }
  } catch (error) {
    console.error('Warning: Could not read .env.local file:', error);
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('\nFound values:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Not set');
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓ Set' : '✗ Not set');
  console.error('\nPlease ensure .env.local contains:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Data types
interface Profile {
  name: string;
  role: string;
  tagline: string;
  socials: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    telegram?: string;
    email?: string;
  };
}

interface TechItem {
  name: string;
  icon: string;
}

interface JourneyItem {
  id: number;
  year: string;
  title: string;
  description: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  tech: string[];
  links: {
    github?: string;
    demo?: string;
    itchio?: string;
  };
}

interface Achievement {
  id: number;
  title: string;
  category: string;
  issuer: string;
  year: string;
  pdfPath: string;
  link?: string;
}

// Static data (same as portfolio.ts)
const PROFILE: Profile = {
  name: "Zakky Ahmad El-Kholily",
  role: "Front-End Web Developer | Public Speaker",
  tagline: "IT Enthusiast dari jurusan Teknik Jaringan Komputer dan Telekomunikasi yang senang memecahkan masalah, membangun sistem yang berjalan dengan baik, terus belajar teknologi baru, serta senang berbagi pengetahuan dan pengalaman.",
  socials: {
    github: "https://github.com/codenamezaxx",
    linkedin: "https://linkedin.com/in/zakky-el",
    instagram: "https://instagram.com/codenamezaxx",
    telegram: "https://t.me/codenamezaxx",
    email: "mailto:zakky.ahmad@protonmail.com"
  }
};

const TECH_STACK: TechItem[] = [
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Godot Engine", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg" },
  { name: "Unity Engine", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg" },
  { name: "C#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
];

const JOURNEY: JourneyItem[] = [
  {
    id: 1,
    year: "2020",
    title: "Mulai belajar programming",
    description: "Dasar-dasar programming dan problem solving."
  },
  {
    id: 2,
    year: "2021",
    title: "Fokus pada Web Development",
    description: "HTML, CSS, JavaScript dan aplikasi web kecil."
  },
  {
    id: 3,
    year: "2022",
    title: "Langkah awal Public Speaking",
    description: "Melatih kemampuan untuk berani berbicara di depan umum."
  },
  {
    id: 4,
    year: "2023",
    title: "Game Development",
    description: "Fokus mempelajari game engine dan interactive systems."
  },
  {    
    id: 5,
    year: "2024",
    title: "Mengikuti Organisasi",
    description: "Melatih teamwork dan leadership melalui kegiatan organisasi."
  },
  {
    id: 6,
    year: "2025",
    title: "Membangun Portofolio",
    description: "Membangun proyek portofolio serta terjun ke dunia kerja melalui program internship."
  },
  { 
    id: 7,
    year: "Sekarang",
    title: "Berkembang dan Membangun Karier",
    description: "Berkomitmen untuk terus belajar teknologi baru, meningkatkan skill, dan membangun karier di bidang IT."
  },
  {
    id: 8,
    year: "Mendatang",
    title: "Menjadi Profesional IT yang Handal",
    description: "Berkeinginan menjadi seorang Fullstack Web Developer serta menjadi Indie Game Developer yang kompeten."
  }
];

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Online Quran",
    description: "Aplikasi pembacaan Al-Quran online dengan fitur pencarian, tafsir, dan terjemahan.",
    category: "Web App",
    image: "/images/quranjs.jpg",
    tech: ["React",  "W3.CSS", "Al-Quran API"],
    links: {
      github: "https://github.com/codenamezaxx/ReactJs-Online-Quran",
      demo: "https://alquran.codenamezaxx.my.id"
    }
  },
  {
    id: 2,
    title: "SI-PORSI GERMAS",
    description: "Platform terpadu untuk mengelola pelaporan, evaluasi, dan arsip program GERMAS di tatanan tempat kerja di Provinsi Jawa Timur. Dibangun saat mengikuti program internship di Dinas Kesehatan Provinsi Jawa Timur.",
    category: "Web App",
    image: "/images/germas.png",
    tech: ["React", "Laravel", "MySQL", "PHP", "TypeScript", "Tailwind"],
    links: {
      github: "https://github.com/codenamezaxx/siporsi-germas",
      demo: "https://demo.com"
    }
  },
  {
    id: 3,
    title: "Cyberurnner",
    description: "Game platformer 2D dengan tema cyberpunk. Pemain mengendalikan karakter yang harus berlari dan melompat melewati rintangan serta serangan musuh sambil mengumpulkan koin dan gems.",
    category: "Game Dev",
    image: "https://img.itch.zone/aW1nLzkwNzYzNTEuanBn/315x250%23c/uI6egT.jpg",
    tech: ["Godot Engine", "GDScript", "Photoshop", "Aseprite"],
    links: {
      itchio: "https://codenamezaxx.itch.io/cyberunner-demo"
    }
  },
  {
    id: 4,
    title: "Diamond Hunter: The Rivals",
    description: "Kumpulkan berlian sebanyak mungkin dan hindari serangan musuh pada game 2D yang sederhana namun seru dan menantang.",
    category: "Game Dev",
    image: "https://img.itch.zone/aW1nLzkxMDI0MDgucG5n/315x250%23c/HWbGq1.png",
    tech: ["Construct 2", "Photoshop"],
    links: {
      itchio: "https://codenamezaxx.itch.io/diamond-hunter-the-rivals",
      demo: "https://diamond-hunter.netlify.app"
    }
  }
];

const ACHIEVEMENTS: Achievement[] = [
  { 
    id: 1, 
    title: "Memulai Pemrograman dengan Python", 
    category: "Kursus Online", 
    issuer: "Dicoding Indonesia",
    year: "2025", 
    pdfPath: "/certificates/cert-1.pdf",
    link: "https://www.dicoding.com/certificates/98XWOL0DLZM3"
  },
  { 
    id: 2, 
    title: "Belajar Dasar AI", 
    category: "Kursus Online", 
    issuer: "Dicoding Indonesia",
    year: "2025", 
    pdfPath: "/certificates/cert-2.pdf",
    link: "https://www.dicoding.com/certificates/98XWOL0DLZM3"
  },
  { 
    id: 3, 
    title: "Participant of Mercu Buana Yogyakarta International Youth Forum (MIYF) 2024", 
    category: "International Forum", 
    issuer: "Mercu Buana University Yogyakarta",
    year: "2024", 
    pdfPath: "/certificates/cert-3.pdf"
  },
  { 
    id: 4, 
    title: "Public Speaking With Trainer", 
    category: "Webinar Online", 
    issuer: "KT&G SangSang University",
    year: "2024", 
    pdfPath: "/certificates/cert-4.pdf",
  },
  { 
    id: 5, 
    title: "Building Persona and Image", 
    category: "Webinar Online", 
    issuer: "KT&G SangSang University",
    year: "2024", 
    pdfPath: "/certificates/cert-5.pdf"
  },
  { 
    id: 6, 
    title: "Youth Leadership Camps", 
    category: "Webinar Online", 
    issuer: "PT. Seasia Intelektual Akademis",
    year: "2024", 
    pdfPath: "/certificates/cert-6.pdf",
  },
  { 
    id: 7, 
    title: "Public Speaking Training Course", 
    category: "Seminar Pelatihan", 
    issuer: "Accelerate Hub & Young People Talks Indonesia",
    year: "2024", 
    pdfPath: "/certificates/cert-7.pdf"
  },
  { 
    id: 8, 
    title: "Belajar HTML", 
    category: "Kursus Online", 
    issuer: "Always Ngoding",
    year: "2022", 
    pdfPath: "/certificates/cert-8.pdf"
  },
  { 
    id: 9, 
    title: "Game Development with JavaScript", 
    category: "Kursus Online", 
    issuer: "Sololearn",
    year: "2022", 
    pdfPath: "/certificates/cert-9.pdf"
  },
  { 
    id: 10, 
    title: "Python Core", 
    category: "Kursus Online", 
    issuer: "Sololearn",
    year: "2021", 
    pdfPath: "/certificates/cert-10.pdf"
  },
  {
    id: 11,
    title: "Python Course Completion",
    category: "Kursus Online",
    issuer: "Mimo",
    year: "2023",
    pdfPath: "/certificates/cert-11.pdf"
  } 
];

// Migration functions
async function migrateProfiles() {
  console.log('Migrating profiles...');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([
        {
          name: PROFILE.name,
          role: PROFILE.role,
          tagline: PROFILE.tagline,
          hero_image_url: null, // Will be uploaded separately
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'id' });

    if (error) throw error;
    console.log('✓ Profiles migrated successfully');
    return true;
  } catch (error) {
    console.error('✗ Error migrating profiles:', error);
    return false;
  }
}

async function migrateContactInfo() {
  console.log('Migrating contact info...');
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .upsert([
        {
          github_url: PROFILE.socials.github,
          linkedin_url: PROFILE.socials.linkedin,
          instagram_url: PROFILE.socials.instagram,
          telegram_url: PROFILE.socials.telegram,
          email: PROFILE.socials.email?.replace('mailto:', ''),
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'id' });

    if (error) throw error;
    console.log('✓ Contact info migrated successfully');
    return true;
  } catch (error) {
    console.error('✗ Error migrating contact info:', error);
    return false;
  }
}

async function migrateTechStack() {
  console.log('Migrating tech stack...');
  try {
    // First, delete existing records
    const { error: deleteError } = await supabase
      .from('tech_stack')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError && deleteError.code !== 'PGRST116') {
      console.warn('Warning: Could not delete existing tech stack:', deleteError);
    }

    const techStackData = TECH_STACK.map((item, index) => ({
      name: item.name,
      icon_url: item.icon,
      display_order: index + 1,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('tech_stack')
      .insert(techStackData);

    if (error) throw error;
    console.log(`✓ Tech stack migrated successfully (${TECH_STACK.length} items)`);
    return true;
  } catch (error) {
    console.error('✗ Error migrating tech stack:', error);
    return false;
  }
}

async function migrateJourneyItems() {
  console.log('Migrating journey items...');
  try {
    // First, delete existing records
    const { error: deleteError } = await supabase
      .from('journey_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError && deleteError.code !== 'PGRST116') {
      console.warn('Warning: Could not delete existing journey items:', deleteError);
    }

    const journeyData = JOURNEY.map((item, index) => ({
      year: item.year,
      title: item.title,
      description: item.description,
      display_order: index + 1,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('journey_items')
      .insert(journeyData);

    if (error) throw error;
    console.log(`✓ Journey items migrated successfully (${JOURNEY.length} items)`);
    return true;
  } catch (error) {
    console.error('✗ Error migrating journey items:', error);
    return false;
  }
}

async function migrateProjects() {
  console.log('Migrating projects...');
  try {
    // First, delete existing records
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError && deleteError.code !== 'PGRST116') {
      console.warn('Warning: Could not delete existing projects:', deleteError);
    }

    const projectsData = PROJECTS.map((item, index) => ({
      title: item.title,
      description: item.description,
      category: item.category,
      image_url: item.image,
      technologies: item.tech,
      github_link: item.links.github,
      live_link: item.links.demo,
      demo_link: item.links.itchio,
      display_order: index + 1,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('projects')
      .insert(projectsData);

    if (error) throw error;
    console.log(`✓ Projects migrated successfully (${PROJECTS.length} items)`);
    return true;
  } catch (error) {
    console.error('✗ Error migrating projects:', error);
    return false;
  }
}

async function migrateAchievements() {
  console.log('Migrating achievements...');
  try {
    // First, delete existing records
    const { error: deleteError } = await supabase
      .from('achievements')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError && deleteError.code !== 'PGRST116') {
      console.warn('Warning: Could not delete existing achievements:', deleteError);
    }

    const achievementsData = ACHIEVEMENTS.map((item, index) => ({
      title: item.title,
      category: item.category,
      issuer: item.issuer,
      year: parseInt(item.year),
      pdf_url: item.pdfPath,
      external_link: item.link,
      display_order: index + 1,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('achievements')
      .insert(achievementsData);

    if (error) throw error;
    console.log(`✓ Achievements migrated successfully (${ACHIEVEMENTS.length} items)`);
    return true;
  } catch (error) {
    console.error('✗ Error migrating achievements:', error);
    return false;
  }
}

async function createBackup() {
  console.log('Creating backup of original data...');
  try {
    const backupData = {
      timestamp: new Date().toISOString(),
      profile: PROFILE,
      techStack: TECH_STACK,
      journey: JOURNEY,
      projects: PROJECTS,
      achievements: ACHIEVEMENTS
    };

    const backupPath = path.join(__dirname, '../backups', `portfolio-backup-${Date.now()}.json`);
    const backupDir = path.dirname(backupPath);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`✓ Backup created at: ${backupPath}`);
    return true;
  } catch (error) {
    console.error('✗ Error creating backup:', error);
    return false;
  }
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting data migration...\n');

  const results = {
    profiles: false,
    contactInfo: false,
    techStack: false,
    journey: false,
    projects: false,
    achievements: false,
    backup: false
  };

  try {
    // Create backup first
    results.backup = await createBackup();
    console.log();

    // Migrate data
    results.profiles = await migrateProfiles();
    results.contactInfo = await migrateContactInfo();
    results.techStack = await migrateTechStack();
    results.journey = await migrateJourneyItems();
    results.projects = await migrateProjects();
    results.achievements = await migrateAchievements();

    console.log('\n📊 Migration Summary:');
    console.log('─'.repeat(40));
    Object.entries(results).forEach(([key, success]) => {
      const status = success ? '✓' : '✗';
      console.log(`${status} ${key}: ${success ? 'Success' : 'Failed'}`);
    });

    const allSuccess = Object.values(results).every(v => v);
    if (allSuccess) {
      console.log('\n✅ All data migrated successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some migrations failed. Please check the errors above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
runMigration();
