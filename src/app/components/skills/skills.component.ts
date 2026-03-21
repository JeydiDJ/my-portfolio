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
    'Firebase': 'assets/tech-icons/firebase-icon.svg',
    'MongoDB': 'assets/tech-icons/mongodb-icon.svg',
    'Tailwind': 'assets/tech-icons/tailwindcss-icon.svg',
    'Node.js': 'assets/tech-icons/nodejs-icon.svg',
    'Git': 'assets/tech-icons/git-scm-icon.svg',
    'Nodejs': 'assets/tech-icons/nodejs-icon.svg',
    'Github': 'assets/tech-icons/github-tile.svg',
    'Python': 'assets/tech-icons/python-icon.svg',
    'Django': 'assets/tech-icons/djangoproject-icon.svg',
    'Supabase':'assets/tech-icons/supabase-icon.svg'
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
        { name: 'Angular', level: 'Advanced', levelPercentage: 85 },
        { name: 'Vue.js', level: 'Intermediate', levelPercentage: 75 },
        { name: 'React', level: 'Intermediate', levelPercentage: 60 },
        { name: 'Tailwind', level: 'Advanced', levelPercentage: 90 },
      ],
    },
    {
      name: 'Backend & DB',
      skills: [
        { name: 'Node.js', level: 'Advanced', levelPercentage: 85 },
        { name: 'Firebase', level: 'Advanced', levelPercentage: 90 },
        { name: 'Supabase', level: 'Intermediate', levelPercentage: 70 },
        { name: 'MongoDB', level: 'Intermediate', levelPercentage: 75 },
        { name: 'Python', level: 'Intermediate', levelPercentage: 70 },
        { name: 'Django', level: 'Beginner', levelPercentage: 30 },
      ],
    },
    {
      name: 'Tools & Others',
      skills: [
        { name: 'Git', level: 'Advanced', levelPercentage: 90 },
        { name: 'Github', level: 'Advanced', levelPercentage: 90 },
      ],
    },
  ];

  // Floating background objects
  floatingObjects: {
    top: number;
    left: number;
    size: number;
    color: string;
    duration: number;
    delay: number;
  }[] = [];

  constructor() {
    // generate 15 random floating shapes
    for (let i = 0; i < 15; i++) {
      this.floatingObjects.push({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 20 + Math.random() * 40,
        color: `rgba(255,255,255,${0.05 + Math.random() * 0.1})`,
        duration: 20 + Math.random() * 20,
        delay: Math.random() * 10
      });
    }
  }
}