import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  contactLinks = [
    { label: 'Email', href: 'mailto:johndave.dejesus@gmail.com', external: false },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/john-dave-de-jesus-502b17207/', external: true },
    { label: 'GitHub', href: 'https://github.com/JeydiDJ', external: true }
  ];

  education = [
    { title: 'Bachelor of Science in Information Technology', school: 'Holy Angel University', logo: 'assets/education/holy-angel-university.png', detail: 'Specialization in Website Development', year: '2025' },
    { title: 'Senior High School Diploma', school: '', logo: '', detail: 'Accountancy, Business, and Management', year: '2020' }
  ];

  experience = [
    { title: 'Full Stack Developer', company: 'TESDA', period: 'Apr 2026 — Present', detail: 'Modernizing internal and public systems with React, Next.js, and PostgreSQL.' },
    { title: 'Freelance Web Developer', company: 'Client projects', period: 'Nov 2025 — Mar 2026', detail: 'Responsive web applications, API integrations, and data visualization.' },
    { title: 'Junior Web Developer', company: 'TherapyPro', period: 'Jun — Oct 2025', detail: 'SharePoint intranets, SPFx, and web applications for internal healthcare tools.' },
    { title: 'Junior Web Developer', company: 'Tiles & More', period: 'Jan 2021 — Jan 2022', detail: 'Website management, product content, and custom HTML and JavaScript integrations.' }
  ];

  certifications = [
    { title: 'Agile Project Management', year: '2025', symbol: 'AP' },
    { title: 'Google Analytics', year: '2025', symbol: 'GA' },
    { title: 'JavaScript Algorithms and Data Structures', year: '2025', symbol: 'JS' },
    { title: 'Responsive Web Design', year: '2025', symbol: '</>' },
    { title: 'CyberOps Associate', year: '2023', symbol: 'CO' }
  ];

  technicalSkills = ['Full-stack development', 'Responsive web design', 'API integration', 'Database-driven systems', 'System modernization', 'SharePoint & SPFx'];
  workingStyle = ['Clear documentation', 'Practical problem solving', 'Maintainable code', 'Thoughtful interfaces', 'End-to-end delivery', 'Continuous learning'];

  toolkit = [
    { name: 'React', icon: 'reactjs-icon.svg' },
    { name: 'Next.js', icon: 'nextjs-icon.svg' },
    { name: 'Angular', icon: 'angular-icon.svg' },
    { name: 'Vue.js', icon: 'vuejs-icon.svg' },
    { name: 'TypeScript', icon: 'typescriptlang-icon.svg' },
    { name: 'HTML', icon: 'w3_html5-icon.svg' },
    { name: 'CSS', icon: 'w3_css-icon~old.svg' },
    { name: 'JavaScript', icon: 'javascript-icon.svg' },
    { name: 'Tailwind', icon: 'tailwindcss-icon.svg' },
    { name: 'Node.js', icon: 'nodejs-icon.svg' },
    { name: 'Python', icon: 'python-icon.svg' },
    { name: 'Django', icon: 'djangoproject-icon.svg' },
    { name: 'Firebase', icon: 'firebase-icon.svg' },
    { name: 'Supabase', icon: 'supabase-icon.svg' },
    { name: 'Git', icon: 'git-scm-icon.svg' },
    { name: 'GitHub', icon: 'github-tile.svg' }
  ];
}
