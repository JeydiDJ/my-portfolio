import { ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss', './skills-motion.scss']
})
export class SkillsComponent implements OnDestroy {
  categoryMotionIcons = ['code', 'database', 'server', 'server'];
  motionIconMap: Record<string, string> = { xUML: 'code', 'E2E Builder': 'server', 'REST APIs': 'code' };
  private detailAnimations = new Map<number, gsap.core.Timeline>();
  constructor(private host: ElementRef<HTMLElement>, private changeDetector: ChangeDetectorRef, private zone: NgZone) {}
  selectedTools = [4, 5, 1, 0];

  selectTool(category: number, skill: number): void {
    if (this.selectedTools[category] === skill) { return; }
    this.detailAnimations.get(category)?.kill();
    this.selectedTools[category] = skill;
    this.changeDetector.detectChanges();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    const detail = this.host.nativeElement.querySelectorAll('.tool-spotlight')[category];
    if (!detail) { return; }
    this.zone.runOutsideAngular(() => {
      const timeline = gsap.timeline()
        .fromTo(detail.querySelector('.spotlight-icon'), { opacity: 0, scale: .7, rotation: -12 },
          { opacity: 1, scale: 1, rotation: 0, duration: .55, ease: 'back.out(1.4)', clearProps: 'opacity,transform' })
        .fromTo(detail.querySelectorAll('h4, p'), { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: .4, stagger: .06, ease: 'power3.out', clearProps: 'opacity,transform' }, .05);
      this.detailAnimations.set(category, timeline);
    });
  }

  ngOnDestroy(): void { this.detailAnimations.forEach(animation => animation.kill()); }

  onToolKeydown(event: KeyboardEvent, category: number, index: number): void {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) { return; }
    event.preventDefault();
    const grid = (event.currentTarget as HTMLElement).parentElement!;
    const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const length = this.skillCategories[category].skills.length;
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns };
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? length - 1 : (index + steps[event.key] + length) % length;
    grid.querySelectorAll<HTMLButtonElement>('button')[next].focus();
  }

  techIconMap: Record<string, string> = {
    SQL: 'sql-icon.png',
    PostgreSQL: 'postgresql-icon.png',
    'REST APIs': 'rest-api-icon.svg',
    'Scheer PAS': 'scheer-pas-icon.png',
    MagicDraw: 'magicdraw-icon.png',
    Docker: 'docker-icon.png',
    'Docker Compose': 'docker-icon.png',
    HTML5: 'w3_html5-icon.svg', CSS3: 'w3_css-icon~old.svg', JavaScript: 'javascript-icon.svg',
    TypeScript: 'typescriptlang-icon.svg', Angular: 'angular-icon.svg', 'Vue.js': 'vuejs-icon.svg',
    React: 'reactjs-icon.svg', 'Next.js': 'nextjs-icon.svg', Firebase: 'firebase-icon.svg',
    MongoDB: 'mongodb-icon.svg', Tailwind: 'tailwindcss-icon.svg', 'Node.js': 'nodejs-icon.svg',
    Git: 'git-scm-icon.svg', GitHub: 'github-tile.svg', Python: 'python-icon.svg',
    Django: 'djangoproject-icon.svg', Supabase: 'supabase-icon.svg', Wix: 'wix-icon.svg'
  };

  skillCategories = [
    {
      name: 'Frontend & languages', color: 'var(--accent)',
      skills: [
        { name: 'JavaScript', description: 'Interactive web applications' },
        { name: 'TypeScript', description: 'Typed application development' },
        { name: 'HTML5', description: 'Semantic web structure' },
        { name: 'CSS3', description: 'Responsive styling & layouts' },
        { name: 'React', description: 'Build component-based interfaces for web apps and dashboards.' },
        { name: 'Next.js', description: 'Full-stack React framework' },
        { name: 'Angular', description: 'Web application framework' },
        { name: 'Vue.js', description: 'Progressive UI framework' },
        { name: 'Tailwind', description: 'Utility-first CSS' }
      ]
    },
    {
      name: 'Backend & data', color: 'var(--accent)',
      skills: [
        { name: 'Node.js', description: 'JavaScript runtime' },
        { name: 'Python', description: 'Backend development & scripting' },
        { name: 'Django', description: 'Python web framework' },
        { name: 'SQL', description: 'Queries & database design' },
        { name: 'PostgreSQL', description: 'Relational databases' },
        { name: 'Supabase', description: 'Connect applications to Postgres databases, authentication, and backend services.' },
        { name: 'Firebase', description: 'Firestore & authentication' },
        { name: 'MongoDB', description: 'Document databases' }
      ]
    },
    {
      name: 'Enterprise integration', color: 'var(--accent)',
      skills: [
        { name: 'Scheer PAS', description: 'Deploy xUML API services and support enterprise integration environments.' },
        { name: 'MagicDraw', description: 'Model and develop xUML API services for deployment to Scheer PAS.' },
        { name: 'xUML', description: 'Executable API service models' },
        { name: 'E2E Builder', description: 'Integration workflow development' },
        { name: 'REST APIs', description: 'API development & integration' },
        { name: 'OAuth 2.0', description: 'API authentication' },
        { name: 'TLS & mTLS', description: 'Secure service communication' }
      ]
    },
    {
      name: 'Platforms & delivery', color: 'var(--accent)',
      skills: [
        { name: 'Docker', description: 'Manage client Scheer PAS containers and troubleshoot logs, service health, and connectivity.' },
        { name: 'Docker Compose', description: 'Scheer PAS container management' },
        { name: 'Ubuntu/Linux', description: 'Logs & service health checks' },
        { name: 'Git', description: 'Version control' },
        { name: 'GitHub', description: 'Code collaboration & delivery' },
        { name: 'Vercel', description: 'Web application deployment' },
        { name: 'Microsoft 365', description: 'Workplace tools & integration' },
        { name: 'SharePoint', description: 'Intranets & business workflows' },
        { name: 'SPFx', description: 'SharePoint development' },
        { name: 'Wix', description: 'Business websites & content' }
      ]
    }
  ];

  fallbackIcon(name: string): string {
    const icons: Record<string, string> = {
      xUML: 'xUML', 'E2E Builder': 'E2E',
      'REST APIs': 'API', 'OAuth 2.0': 'OA', 'TLS & mTLS': 'TLS',
      'Ubuntu/Linux': '>_',
      Vercel: '▲', 'Microsoft 365': 'M', SharePoint: 'S', SPFx: 'SP'
    };
    return icons[name] || name.charAt(0);
  }
}
