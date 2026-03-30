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
    { label: 'Status', value: 'Freelance Web Developer' }
  ];

  strengths = [
    'Focused on growing through real-world web development challenges while building a strong professional foundation in IT.',
    'Experienced in Angular, Vue.js, SharePoint, SPFx, Django, Firebase, WIX, and backend API integration.',
    'Comfortable designing responsive interfaces, implementing application logic, and supporting client and business requirements.'
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
          heading: 'Freelance Web Developer',
          detail: 'November 2025 to Present. Designs and develops web applications and client features using modern JavaScript tools, Angular-based interfaces, backend API integration, data visualization, and task management functionality.'
        },
        {
          heading: 'Junior Web Developer at TherapyPro',
          detail: 'June 2025 to October 2025. Developed intranet sites using Microsoft SharePoint and SPFx while also building full stack applications with Angular.js, Vue.js, and Python Django for healthcare-related internal tools.'
        },
        {
          heading: 'Junior Web Developer at TILES & MORE',
          detail: 'January 2021 to January 2022. Built and maintained the company website in WIX, added product updates, and implemented custom HTML and JavaScript integrations while keeping a sleek minimal visual style.'
        }
      ]
    },
    {
      title: 'Education',
      eyebrow: 'Academic Background',
      items: [
        {
          heading: 'Holy Angel University',
          detail: 'Bachelor of Science in Information Technology with Area of Specialization in Website Development. Completed in November 2025.'
        },
        {
          heading: 'Pampanga High School',
          detail: 'Senior High School Diploma under the ABM track, focused on Accountancy, Business, and Management. Completed in April 2020.'
        },
      ]
    },
    {
      title: 'Technical Skills',
      eyebrow: 'Core Tools',
      items: [
        {
          heading: 'Web Development',
          detail: 'Frontend development, backend development, responsive interfaces, API integration, application logic, and production-minded feature implementation.'
        },
        {
          heading: 'Platforms And Business Tools',
          detail: 'Microsoft 365 and M365 SharePoint, including practical intranet and workflow-oriented implementation.'
        },
        {
          heading: 'Development Approach',
          detail: 'Responsive interfaces, API integration, application logic, feature development, and production-minded implementation.'
        }
      ]
    },
    {
      title: 'Skills Snapshot',
      eyebrow: 'Technologies',
      items: [
        {
          heading: 'Frontend And Backend',
          detail: 'HTML, CSS, JavaScript, Python, frontend development, backend development, AngularJS, Firebase, and NoSQL.'
        },
        {
          heading: 'Languages',
          detail: 'English and Tagalog.'
        }
      ]
    },
    {
      title: 'Certifications',
      eyebrow: 'Credentials',
      items: [
        {
          heading: 'Certifications Earned in 2025',
          detail: 'Agile Project Management, Google Analytics, JavaScript Algorithms and Data Structures, Responsive Web Design.'
        },
        {
          heading: 'Certification Earned in 2023',
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
          detail: 'Work Supervisor and System Administrator at TherapyPRO. Contact: 09082051299.'
        },
        {
          heading: 'Kathrine Aguilar',
          detail: 'Capstone Thesis Adviser, Professor, and Instructor at Holy Angel University. Contact: 09174352345. Email: khatzaguilar23@gmail.com.'
        },
        {
          heading: 'Eone Zeus Lorenzo',
          detail: 'Former Colleague and System Administrator at TherapyPRO. Contact: 09161741103.'
        }
      ]
    }
  ];

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}
