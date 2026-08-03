export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  images: string[];
  technologies: string[];
  links: {
    github?: string;
    live?: string;
    demo?: string;
  };
  category?: string;
  featured?: boolean;
}

export interface ProjectFilter {
  technology?: string;
  search?: string;
}
