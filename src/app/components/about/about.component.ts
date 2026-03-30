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
      title: 'Objective',
      eyebrow: 'Career Goal',
      items: [
        {
          heading: 'Professional Direction',
          detail: 'To pursue opportunities that allow me to test my capabilities, take on challenges, continuously develop my skills, and contribute effectively while growing within the IT industry.'
        }
      ]
    },
    {
      title: 'Work Experience',
      eyebrow: 'Professional Background',
      items: [
        {
          heading: 'Freelance Web Developer | 2025 Nov - Present',
          detail: 'Designs and develops web applications and client features using modern JavaScript tools, Angular-based interfaces, backend API integration, data visualization, and task management functionality.'
        },
        {
          heading: 'TherapyPro | Junior Web Developer | 2025 Jun - 2025 Oct',
          detail: 'Developed intranet sites using Microsoft SharePoint and SPFx while also building full stack applications with Angular.js, Vue.js, and Python Django for healthcare-related internal tools.'
        },
        {
          heading: 'TILES & MORE | Junior Web Developer | 2021 Jan - 2022 Jan',
          detail: 'Built and maintained the company website in WIX, added product updates, and implemented custom HTML and JavaScript integrations while keeping a sleek minimal visual style.'
        }
      ]
    },
    {
      title: 'Education',
      eyebrow: 'Academic Background',
      items: [
        {
          heading: 'Holy Angel University | 2025 Nov',
          detail: 'Bachelor of Science in Information Technology with Area of Specialization in Website Development.'
        },
        {
          heading: 'Pampanga High School | 2020 Apr',
          detail: 'Senior High School Diploma under the ABM track, focused on Accountancy, Business, and Management.'
        },
        {
          heading: 'Field',
          detail: 'Computer Science and Information Technology with strong emphasis on web development.'
        }
      ]
    },
    {
      title: 'Technical Skills',
      eyebrow: 'Core Tools',
      items: [
        {
          heading: 'Development',
          detail: 'HTML, CSS, JavaScript, Python, frontend development, backend development, AngularJS, Firebase, and NoSQL.'
        },
        {
          heading: 'Business Tools',
          detail: 'Microsoft 365 and M365 SharePoint, including practical intranet and workflow-oriented implementation.'
        },
        {
          heading: 'Working Style',
          detail: 'Responsive interfaces, API integration, application logic, feature development, and production-minded implementation.'
        }
      ]
    },
    {
      title: 'Personal Info',
      eyebrow: 'Profile Details',
      items: [
        {
          heading: 'Basic Information',
          detail: 'Birthdate: November 18, 2002 | Civil Status: Single | Gender: Male | Nationality: Filipino'
        },
        {
          heading: 'Address',
          detail: 'Blk 1 Lot 3, Panipuan, Mexico, Pampanga, Philippines, Central Luzon (Region III).'
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
          heading: '2025',
          detail: 'Agile Project Management, Google Analytics, JavaScript Algorithms and Data Structures, Responsive Web Design.'
        },
        {
          heading: '2023',
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
          detail: 'Work Supervisor, System Administrator at TherapyPRO | 09082051299'
        },
        {
          heading: 'Kathrine Aguilar',
          detail: 'Capstone Thesis Adviser, Professor and Instructor at Holy Angel University | 09174352345 | khatzaguilar23@gmail.com'
        },
        {
          heading: 'Eone Zeus Lorenzo',
          detail: 'Former Colleague, System Administrator at TherapyPRO | 09161741103'
        }
      ]
    }
  ];

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}
