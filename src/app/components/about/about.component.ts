// about.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  isExpanded = false;

  contactLinks = [
    { label: 'Email', value: 'johndave.dejesus@gmail.com', href: 'mailto:johndave.dejesus@gmail.com', type: 'email' },
    { label: 'Mobile', value: '09368984316', href: 'tel:09368984316', type: 'phone' },
    { label: 'LinkedIn', value: 'john-dave-de-jesus', href: 'https://www.linkedin.com/in/john-dave-de-jesus-502b17207/', type: 'linkedin' },
    { label: 'GitHub', value: 'JeydiDJ', href: 'https://github.com/JeydiDJ', type: 'github' }
  ];

  profileStats = [
    { label: 'Base', value: 'Mexico, Pampanga' },
    { label: 'Nationality', value: 'Filipino' },
    { label: 'Role', value: 'Full Stack Developer' }
  ];

  strengths = [
    'Builds and modernizes internal systems, public-facing platforms, and business web applications with practical full stack implementation.',
    'Experienced across React, Next.js, Angular, Vue.js, PostgreSQL, Firebase, SharePoint, and backend integration workflows.',
    'Comfortable handling frontend architecture, application logic, system migration, documentation, and delivery across government and client projects.'
  ];

  resumeSections = [
    {
      title: 'Career Objective',
      eyebrow: 'Professional Focus',
      items: [
        {
          heading: 'Where I Want To Grow',
          detail: 'To pursue opportunities that allow me to test my capabilities, take on challenges, continuously develop my skills, and contribute effectively while growing within the IT industry.'
        }
      ]
    },
    {
      title: 'Experience',
      eyebrow: 'Professional Background',
      items: [
        {
          heading: 'Full Stack Developer at TESDA',
          detail: 'April 2026 to Present. Develops and migrates legacy internal and public systems into modern frameworks using React, Next.js, and PostgreSQL, while also supporting documentation and office-level technical requirements.'
        },
        {
          heading: 'Freelance Web Developer',
          detail: 'November 2025 to March 2026. Designed and developed web applications for clients with responsive interfaces, application logic, backend API integration, data visualization, and task management features.'
        },
        {
          heading: 'Junior Web Developer at TherapyPro',
          detail: 'June 2025 to October 2025. Developed intranet sites using Microsoft SharePoint and SPFx and contributed to full stack applications using Angular.js, Vue.js, and Python Django for healthcare-related internal tools.'
        },
        {
          heading: 'Junior Web Developer at Tiles & More',
          detail: 'January 2021 to January 2022. Managed the company website in WIX, updated product content, and implemented custom HTML and JavaScript integrations while maintaining a clean and minimal visual direction.'
        }
      ]
    },
    {
      title: 'Education',
      eyebrow: 'Academic Background',
      items: [
        {
          heading: 'Bachelor of Science in Information Technology',
          detail: 'Bachelor of Science in Information Technology with Area of Specialization in Website Development. Completed in November 2025.'
        },
        {
          heading: 'Senior High School Diploma',
          detail: 'Senior High School Diploma under the ABM track, focused on Accountancy, Business, and Management. Completed in April 2020.'
        },
      ]
    },
    {
      title: 'Technical Skills',
      eyebrow: 'Core Tools',
      items: [
        {
          heading: 'Application Development',
          detail: 'Frontend development, backend development, responsive interfaces, API integration, application logic, and production-minded feature implementation for modern web systems.'
        },
        {
          heading: 'Platforms and Business Tools',
          detail: 'Microsoft 365 and M365 SharePoint, including practical intranet and workflow-oriented implementation.'
        },
        {
          heading: 'Engineering Approach',
          detail: 'System modernization, scalable application structure, migration support, documentation, and maintainable delivery across internal and public systems.'
        }
      ]
    },
    {
      title: 'Skills Snapshot',
      eyebrow: 'Technologies',
      items: [
        {
          heading: 'Frontend and Backend',
          detail: 'HTML, CSS, JavaScript, Python, AngularJS, React, Next.js, Firebase, PostgreSQL, NoSQL, and full stack web development.'
        },
        {
          heading: 'Working Languages',
          detail: 'English and Tagalog.'
        }
      ]
    },
    {
      title: 'Certifications',
      eyebrow: 'Credentials',
      items: [
        {
          heading: '2025 Certifications',
          detail: 'Agile Project Management, Google Analytics, JavaScript Algorithms and Data Structures, Responsive Web Design.'
        },
        {
          heading: '2023 Certification',
          detail: 'CyberOps Associate.'
        }
      ]
    },
    {
      title: 'References',
      eyebrow: 'Professional Contacts',
      items: [
        {
          heading: 'Levi Cedric Valdez',
          detail: 'Work Supervisor, System Administrator at TherapyPRO. Contact: 09082051299.'
        },
        {
          heading: 'Kathrine Aguilar',
          detail: 'Capstone Thesis Adviser, Professor, and Instructor at Holy Angel University. Contact: 09174352345. Email: khatzaguilar23@gmail.com.'
        },
        {
          heading: 'Eone Zeus Lorenzo',
          detail: 'Former Colleague, System Administrator at TherapyPRO. Contact: 09161741103.'
        }
      ]
    }
  ];

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}
