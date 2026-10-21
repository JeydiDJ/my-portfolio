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
    { name: 'Python', icon: 'python-icon.svg' }
  ];
}
