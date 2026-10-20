import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  techIconMap: Record<string, string> = {
    HTML: 'w3_html5-icon.svg', CSS: 'w3_css-icon~old.svg', JavaScript: 'javascript-icon.svg',
    TypeScript: 'typescriptlang-icon.svg', Angular: 'angular-icon.svg', 'Vue.js': 'vuejs-icon.svg',
    React: 'reactjs-icon.svg', 'Next.js': 'nextjs-icon.svg', Firebase: 'firebase-icon.svg',
    MongoDB: 'mongodb-icon.svg', Tailwind: 'tailwindcss-icon.svg', 'Node.js': 'nodejs-icon.svg',
    Git: 'git-scm-icon.svg', GitHub: 'github-tile.svg', Python: 'python-icon.svg',
    Django: 'djangoproject-icon.svg', Supabase: 'supabase-icon.svg', Wix: 'wix-icon.svg'
  };

  skillCategories = [
    {
      name: 'Frontend', color: '#e76491',
      skills: [
        { name: 'HTML', description: 'Semantic web structure' },
        { name: 'CSS', description: 'Responsive styling & layouts' },
        { name: 'JavaScript', description: 'Interactive web experiences' },
        { name: 'TypeScript', description: 'Typed application development' }
      ]
    },
    {
      name: 'Frameworks', color: '#59b9e3',
      skills: [
        { name: 'React', description: 'Component-based interfaces' },
        { name: 'Next.js', description: 'Full-stack React framework' },
        { name: 'Angular', description: 'Web application framework' },
        { name: 'Vue.js', description: 'Progressive UI framework' },
        { name: 'Tailwind', description: 'Utility-first CSS' }
      ]
    },
    {
      name: 'Backend & data', color: '#a38ae7',
      skills: [
        { name: 'Node.js', description: 'JavaScript runtime' },
        { name: 'Python', description: 'Backend development & scripting' },
        { name: 'Django', description: 'Python web framework' },
        { name: 'PostgreSQL', description: 'Relational databases' },
        { name: 'Firebase', description: 'Authentication & real-time data' },
        { name: 'Supabase', description: 'Postgres & backend services' },
        { name: 'MongoDB', description: 'Document databases' }
      ]
    },
    {
      name: 'Platforms & delivery', color: '#e7a855',
      skills: [
        { name: 'Git', description: 'Version control' },
        { name: 'GitHub', description: 'Code collaboration & delivery' },
        { name: 'Microsoft 365', description: 'Workplace tools & integration' },
        { name: 'SharePoint', description: 'Intranets & business workflows' },
        { name: 'SPFx', description: 'SharePoint development' },
        { name: 'Wix', description: 'Business websites & content' }
      ]
    }
  ];
}
