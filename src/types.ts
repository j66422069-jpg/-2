export interface HomeData {
  name: string;
  job_title: string;
  intro: string;
  resume_url: string;
}

export interface AboutData {
  profile_image: string;
  bio: string;
  scope: string;
  career: string;
  workflow: string;
  strengths: string;
}

export interface ProjectVideo {
  id?: number;
  project_id?: number;
  title: string;
  description: string;
  youtube_url: string;
}

export interface ProjectData {
  id?: number;
  title: string;
  year: string;
  category: string;
  role: string;
  summary: string;
  thumbnail: string;
  camera: string;
  lens: string;
  lighting: string;
  color: string;
  contribution: string;
  is_featured: boolean;
  videos: ProjectVideo[];
}

export interface EquipmentData {
  id?: number;
  category: string;
  name: string;
  context: string;
}

export interface ContactData {
  email: string;
  instagram: string;
  instagram_text: string;
  phone: string;
}

export interface PortfolioData {
  home: HomeData;
  about: AboutData;
  projects: ProjectData[];
  equipment: EquipmentData[];
  contact: ContactData;
}
