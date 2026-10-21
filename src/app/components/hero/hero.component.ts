import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  technologies = [
    { name: 'Scheer PAS', icon: 'scheer-pas-icon.png' },
    { name: 'MagicDraw', icon: 'magicdraw-icon.png' },
    { name: 'REST APIs', icon: 'rest-api-icon.svg' },
    { name: 'Docker', icon: 'docker-icon.png' },
    { name: 'React', icon: 'reactjs-icon.svg' },
    { name: 'Next.js', icon: 'nextjs-icon.svg' },
    { name: 'Supabase', icon: 'supabase-icon.svg' },
    { name: 'TypeScript', icon: 'typescriptlang-icon.svg' },
    { name: 'JavaScript', icon: 'javascript-icon.svg' },
    { name: 'Angular', icon: 'angular-icon.svg' },
    { name: 'Vue.js', icon: 'vuejs-icon.svg' },
    { name: 'Node.js', icon: 'nodejs-icon.svg' },
    { name: 'Python', icon: 'python-icon.svg' },
    { name: 'Django', icon: 'djangoproject-icon.svg' },
    { name: 'Firebase', icon: 'firebase-icon.svg' },
    { name: 'MongoDB', icon: 'mongodb-icon.svg' },
    { name: 'Tailwind CSS', icon: 'tailwindcss-icon.svg' },
    { name: 'Git', icon: 'git-scm-icon.svg' }
  ];
}
