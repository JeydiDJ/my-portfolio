import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
  // Map tech names to icons
  techIconMap: { [key: string]: string } = {
    'HTML': 'assets/tech-icons/w3_html5-icon.svg',
    'CSS': 'assets/tech-icons/w3_css-icon~old.svg',
    'JavaScript': 'assets/tech-icons/javascript-icon.svg',
    'TypeScript': 'assets/tech-icons/typescriptlang-icon.svg',
    'Angular': 'assets/tech-icons/angular-icon.svg',
    'Vue.js': 'assets/tech-icons/vuejs-icon.svg',
    'React': 'assets/tech-icons/reactjs-icon.svg',
    'Next.js': 'assets/tech-icons/nextjs-icon.svg',
    'Firebase': 'assets/tech-icons/firebase-icon.svg',
    'MongoDB': 'assets/tech-icons/mongodb-icon.svg',
    'PostgreSQL': 'assets/tech-icons/mongodb-icon.svg',
    'Tailwind': 'assets/tech-icons/tailwindcss-icon.svg',
    'Node.js': 'assets/tech-icons/nodejs-icon.svg',
    'Git': 'assets/tech-icons/git-scm-icon.svg',
    'Nodejs': 'assets/tech-icons/nodejs-icon.svg',
    'Github': 'assets/tech-icons/github-tile.svg',
    'Python': 'assets/tech-icons/python-icon.svg',
    'Django': 'assets/tech-icons/djangoproject-icon.svg',
    'Supabase':'assets/tech-icons/supabase-icon.svg',
    'Wix': 'assets/tech-icons/wix-icon.svg',
    'SharePoint': 'assets/tech-icons/wix-icon.svg',
    'SPFx': 'assets/tech-icons/wix-icon.svg',
    'Microsoft 365': 'assets/tech-icons/wix-icon.svg'
  };

  // Skill categories
  skillCategories = [
    {
      name: 'Frontend',
      skills: [
        { name: 'HTML', level: 'Expert', levelPercentage: 95 },
        { name: 'CSS', level: 'Expert', levelPercentage: 90 },
        { name: 'JavaScript', level: 'Expert', levelPercentage: 90 },
        { name: 'TypeScript', level: 'Advanced', levelPercentage: 85 },
        { name: 'React', level: 'Advanced', levelPercentage: 85 },
        { name: 'Next.js', level: 'Advanced', levelPercentage: 82 },
        { name: 'Angular', level: 'Advanced', levelPercentage: 82 },
        { name: 'Vue.js', level: 'Intermediate', levelPercentage: 74 },
        { name: 'Tailwind', level: 'Advanced', levelPercentage: 90 },
      ],
    },
    {
      name: 'Backend and Data',
      skills: [
        { name: 'Node.js', level: 'Advanced', levelPercentage: 82 },
        { name: 'Python', level: 'Advanced', levelPercentage: 80 },
        { name: 'PostgreSQL', level: 'Advanced', levelPercentage: 82 },
        { name: 'Django', level: 'Intermediate', levelPercentage: 68 },
        { name: 'Firebase', level: 'Advanced', levelPercentage: 90 },
        { name: 'Supabase', level: 'Intermediate', levelPercentage: 70 },
        { name: 'MongoDB', level: 'Intermediate', levelPercentage: 75 },
      ],
    },
    {
      name: 'Platforms and Delivery',
      skills: [
        { name: 'Git', level: 'Advanced', levelPercentage: 90 },
        { name: 'Github', level: 'Advanced', levelPercentage: 90 },
        { name: 'Microsoft 365', level: 'Advanced', levelPercentage: 84 },
        { name: 'SharePoint', level: 'Advanced', levelPercentage: 84 },
        { name: 'SPFx', level: 'Intermediate', levelPercentage: 72 },
        { name: 'Wix', level: 'Advanced', levelPercentage: 90 },
      ],
    },
  ];
}
