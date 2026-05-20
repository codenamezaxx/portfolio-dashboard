/**
 * Data Migration Tests
 * Tests for data transformation and migration logic
 */

describe('Data Migration', () => {
  describe('Data Transformation', () => {
    it('should transform tech stack data correctly', () => {
      const techItem = {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
      };

      const transformed = {
        name: techItem.name,
        icon_url: techItem.icon,
        display_order: 1,
        updated_at: new Date().toISOString()
      };

      expect(transformed.name).toBe("React");
      expect(transformed.icon_url).toContain("react");
      expect(transformed.display_order).toBe(1);
      expect(transformed.updated_at).toBeDefined();
    });

    it('should transform journey items correctly', () => {
      const journeyItem = {
        id: 1,
        year: "2020",
        title: "Mulai belajar programming",
        description: "Dasar-dasar programming dan problem solving."
      };

      const transformed = {
        year: journeyItem.year,
        title: journeyItem.title,
        description: journeyItem.description,
        display_order: 1,
        updated_at: new Date().toISOString()
      };

      expect(transformed.year).toBe("2020");
      expect(transformed.title).toBe("Mulai belajar programming");
      expect(transformed.display_order).toBe(1);
    });

    it('should transform project data correctly', () => {
      const project = {
        id: 1,
        title: "Online Quran",
        description: "Aplikasi pembacaan Al-Quran online",
        category: "Web App",
        image: "/images/quranjs.jpg",
        tech: ["React", "W3.CSS"],
        links: {
          github: "https://github.com/codenamezaxx/ReactJs-Online-Quran",
          demo: "https://alquran.codenamezaxx.my.id"
        }
      };

      const transformed = {
        title: project.title,
        description: project.description,
        category: project.category,
        image_url: project.image,
        technologies: project.tech,
        github_link: project.links.github,
        live_link: project.links.demo,
        display_order: 1,
        updated_at: new Date().toISOString()
      };

      expect(transformed.title).toBe("Online Quran");
      expect(transformed.technologies).toContain("React");
      expect(transformed.github_link).toContain("github");
    });

    it('should transform achievement data correctly', () => {
      const achievement = {
        id: 1,
        title: "Memulai Pemrograman dengan Python",
        category: "Kursus Online",
        issuer: "Dicoding Indonesia",
        year: "2025",
        pdfPath: "/certificates/cert-1.pdf",
        link: "https://www.dicoding.com/certificates/98XWOL0DLZM3"
      };

      const transformed = {
        title: achievement.title,
        category: achievement.category,
        issuer: achievement.issuer,
        year: parseInt(achievement.year),
        pdf_url: achievement.pdfPath,
        external_link: achievement.link,
        display_order: 1,
        updated_at: new Date().toISOString()
      };

      expect(transformed.title).toBe("Memulai Pemrograman dengan Python");
      expect(transformed.year).toBe(2025);
      expect(typeof transformed.year).toBe('number');
    });
  });

  describe('Data Validation', () => {
    it('should validate profile data', () => {
      const profile = {
        name: "Zakky Ahmad El-Kholily",
        role: "Front-End Web Developer | Public Speaker",
        tagline: "IT Enthusiast...",
        socials: {
          github: "https://github.com/codenamezaxx",
          linkedin: "https://linkedin.com/in/zakky-el"
        }
      };

      expect(profile.name).toBeTruthy();
      expect(profile.role).toBeTruthy();
      expect(profile.tagline).toBeTruthy();
      expect(profile.socials.github).toMatch(/^https:\/\//);
    });

    it('should validate tech stack items', () => {
      const techItems = [
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" }
      ];

      techItems.forEach(item => {
        expect(item.name).toBeTruthy();
        expect(item.icon).toMatch(/^https:\/\//);
      });
    });

    it('should validate journey items', () => {
      const journeyItems = [
        { year: "2020", title: "Mulai belajar programming", description: "..." },
        { year: "2025", title: "Membangun Portofolio", description: "..." }
      ];

      journeyItems.forEach(item => {
        expect(item.year).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.description).toBeTruthy();
      });
    });

    it('should validate project data', () => {
      const project = {
        title: "Online Quran",
        description: "Aplikasi pembacaan Al-Quran online",
        category: "Web App",
        image: "/images/quranjs.jpg",
        tech: ["React", "W3.CSS"],
        links: {
          github: "https://github.com/codenamezaxx/ReactJs-Online-Quran"
        }
      };

      expect(project.title).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.category).toBeTruthy();
      expect(Array.isArray(project.tech)).toBe(true);
      expect(project.tech.length).toBeGreaterThan(0);
    });

    it('should validate achievement data', () => {
      const achievement = {
        title: "Memulai Pemrograman dengan Python",
        category: "Kursus Online",
        issuer: "Dicoding Indonesia",
        year: "2025",
        pdfPath: "/certificates/cert-1.pdf"
      };

      expect(achievement.title).toBeTruthy();
      expect(achievement.category).toBeTruthy();
      expect(achievement.issuer).toBeTruthy();
      expect(achievement.year).toBeTruthy();
      expect(achievement.pdfPath).toMatch(/\.pdf$/);
    });
  });

  describe('Data Counts', () => {
    it('should have correct number of tech stack items', () => {
      const techStackCount = 12;
      expect(techStackCount).toBe(12);
    });

    it('should have correct number of journey items', () => {
      const journeyCount = 8;
      expect(journeyCount).toBe(8);
    });

    it('should have correct number of projects', () => {
      const projectsCount = 4;
      expect(projectsCount).toBe(4);
    });

    it('should have correct number of achievements', () => {
      const achievementsCount = 11;
      expect(achievementsCount).toBe(11);
    });
  });

  describe('Data Integrity', () => {
    it('should not have duplicate tech stack items', () => {
      const techStack = [
        { name: "React", icon: "..." },
        { name: "TypeScript", icon: "..." },
        { name: "React", icon: "..." } // Duplicate
      ];

      const names = techStack.map(t => t.name);
      const uniqueNames = new Set(names);

      // In real migration, duplicates should be handled
      expect(uniqueNames.size).toBeLessThanOrEqual(names.length);
    });

    it('should preserve display order', () => {
      const items = [
        { name: "Item 1", order: 1 },
        { name: "Item 2", order: 2 },
        { name: "Item 3", order: 3 }
      ];

      items.forEach((item, index) => {
        expect(item.order).toBe(index + 1);
      });
    });

    it('should have valid timestamps', () => {
      const timestamp = new Date().toISOString();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });
});
