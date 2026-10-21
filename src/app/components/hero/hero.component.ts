import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss', './hero-terminal.scss']
})
export class HeroComponent implements OnInit, OnDestroy {
  private readonly roles = ['Software engineer', 'Systems integration', 'Full Stack Developer'];
  roleText = this.roles[0];
  private roleIndex = 0;
  private roleTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.roleText = this.roles.join(' / ');
      return;
    }
    this.scheduleRoleChange();
  }

  private scheduleRoleChange(): void {
    this.roleTimer = setTimeout(() => this.eraseRole(), 2600);
  }

  private eraseRole(): void {
    if (this.roleText.length) {
      this.roleText = this.roleText.slice(0, -1);
      this.roleTimer = setTimeout(() => this.eraseRole(), 35);
      return;
    }
    this.roleIndex = (this.roleIndex + 1) % this.roles.length;
    this.roleTimer = setTimeout(() => this.typeRole(), 180);
  }

  private typeRole(): void {
    const next = this.roles[this.roleIndex];
    this.roleText = next.slice(0, this.roleText.length + 1);
    if (this.roleText.length < next.length) {
      this.roleTimer = setTimeout(() => this.typeRole(), 65);
    } else {
      this.scheduleRoleChange();
    }
  }

  ngOnDestroy(): void { clearTimeout(this.roleTimer); }

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
