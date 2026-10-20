import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  contactLinks = [
    { label: 'Call', href: 'tel:+639368984316', external: false },
    { label: 'Email', href: 'mailto:johndave.dejesus@gmail.com', external: false },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/john-dave-de-jesus-502b17207/', external: true },
    { label: 'GitHub', href: 'https://github.com/JeydiDJ', external: true }
  ];

  education = [
    { title: 'Bachelor of Science in Information Technology', school: 'Holy Angel University', logo: 'assets/education/holy-angel-university.png', detail: 'Major in Website Development', year: '2025', grade: 'GWA: 1.65' },
    { title: 'Senior High School Diploma', school: '', logo: '', detail: 'Accountancy, Business, and Management', year: '2020', grade: '' }
  ];

  experience = [
    {
      title: 'Software Engineer',
      company: 'OneTool Solutions Inc.',
      period: 'Aug 2026 — Present',
      detail: 'Develop xUML API services in MagicDraw and deploy them to Scheer PAS. Configure API resources, service operations, request and response models, and enterprise integration workflows. Use Docker and Docker Compose to manage Scheer PAS environments and troubleshoot client PAS installations, container logs, service health, and backend connectivity on Ubuntu/Linux. Implement and troubleshoot OAuth 2.0, HTTPS/TLS, and mutual TLS authentication. Investigate certificate and deployment issues, provide client technical support, and document configuration changes and resolutions.'
    },
    {
      title: 'Full Stack Developer',
      company: 'Technical Education and Skills Development Authority (TESDA)',
      period: 'Apr — Jul 2026',
      detail: 'Developed internal and public-facing applications with React, Next.js, PostgreSQL, and modern JavaScript. Designed GIS-enabled dashboards with drill-down analytics and geographic data visualization. Built database structures and automated data validation and cleaning workflows, and collaborated with stakeholders to modernize legacy applications.'
    },
    {
      title: 'Freelance Web Developer',
      company: 'Self-Employed',
      period: 'Nov 2025 — Mar 2026',
      detail: 'Developed custom applications and dashboards, including responsive Angular interfaces integrated with REST APIs. Worked directly with clients from requirements gathering and planning through development and deployment.'
    },
    {
      title: 'Junior Web Developer',
      company: 'TherapyPro',
      period: 'Jun — Oct 2025',
      detail: 'Developed SharePoint intranet solutions with SPFx. Built and supported full-stack applications using Angular, Vue.js, and Django, and collaborated on enterprise workflow improvements and application support.'
    },
    {
      title: 'Junior Web Developer',
      company: 'Tiles & More',
      period: 'Jan 2021 — Jan 2022',
      detail: 'Developed and maintained the company website with Wix and custom scripts. Implemented custom HTML, CSS, and JavaScript functionality to improve website capabilities.'
    }
  ];

  certifications = [
    { title: 'Agile Project Management', year: '2025', symbol: 'AP' },
    { title: 'Google Analytics', year: '2025', symbol: 'GA' },
    { title: 'JavaScript Algorithms and Data Structures', year: '2025', symbol: 'JS' },
    { title: 'Responsive Web Design', year: '2025', symbol: '</>' },
    { title: 'CyberOps Associate', year: '2023', symbol: 'CO' }
  ];

  technicalSkills = ['xUML API service development', 'Scheer PAS deployment & support', 'Docker environment management', 'Enterprise system integration', 'Full-stack development', 'Client technical support', 'Troubleshooting & log analysis', 'Database design', 'GIS dashboards & visualization', 'ETL & data cleaning'];
  workingStyle = ['Clear documentation', 'Practical problem solving', 'Maintainable code', 'Thoughtful interfaces', 'End-to-end delivery', 'Continuous learning'];

  toolkit = [
    { name: 'Scheer PAS', icon: 'scheer-pas-icon.png' },
    { name: 'MagicDraw', icon: 'magicdraw-icon.png' },
    { name: 'Docker', icon: 'docker-icon.png' },
    { name: 'React', icon: 'reactjs-icon.svg' },
    { name: 'Next.js', icon: 'nextjs-icon.svg' },
    { name: 'Angular', icon: 'angular-icon.svg' },
    { name: 'Vue.js', icon: 'vuejs-icon.svg' },
    { name: 'TypeScript', icon: 'typescriptlang-icon.svg' },
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
