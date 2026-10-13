require('dotenv').config();
const mongoose = require('mongoose');
const Internship = require('./models/Internship');

const internships = [
  {
    title: 'Frontend Developer Intern',
    company: 'Google',
    companyLogo: 'https://logo.clearbit.com/google.com',
    description: 'Join our engineering team to build beautiful and responsive user interfaces for millions of users worldwide. You will work on cutting-edge web technologies and contribute to products used by billions.',
    responsibilities: [
      'Develop and maintain responsive web applications using React and modern JavaScript',
      'Collaborate with UX designers to implement pixel-perfect interfaces',
      'Optimize web performance and ensure cross-browser compatibility',
      'Participate in code reviews and technical discussions',
      'Contribute to component libraries and design systems'
    ],
    requiredSkills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
    preferredSkills: ['Next.js', 'Tailwind CSS', 'GraphQL'],
    location: 'Mountain View, CA',
    workMode: 'On-site',
    duration: '12 weeks',
    stipend: '$8000/month',
    stipendAmount: 8000,
    applicationDeadline: new Date('2024-03-15'),
    openings: 15,
    category: 'Engineering',
    logo: 'https://logo.clearbit.com/google.com'
  },
  {
    title: 'Full Stack Developer Intern',
    company: 'Microsoft',
    companyLogo: 'https://logo.clearbit.com/microsoft.com',
    description: 'Work on end-to-end development of enterprise applications serving millions of customers. You will gain experience in both frontend and backend technologies while working on real-world projects.',
    responsibilities: [
      'Build scalable web applications using React and Node.js',
      'Design and implement RESTful APIs and microservices',
      'Work with SQL and NoSQL databases',
      'Implement CI/CD pipelines and automated testing',
      'Collaborate with cross-functional teams'
    ],
    requiredSkills: ['React', 'Node.js', 'JavaScript', 'SQL', 'Git'],
    preferredSkills: ['TypeScript', 'Docker', 'AWS', 'MongoDB'],
    location: 'Redmond, WA',
    workMode: 'Hybrid',
    duration: '16 weeks',
    stipend: '$7500/month',
    stipendAmount: 7500,
    applicationDeadline: new Date('2024-03-20'),
    openings: 20,
    category: 'Engineering',
    logo: 'https://logo.clearbit.com/microsoft.com'
  },
  {
    title: 'React.js Developer Intern',
    company: 'Meta',
    companyLogo: 'https://logo.clearbit.com/meta.com',
    description: 'Contribute to the React ecosystem and help build the future of web development. You will work with the React team at Meta on open-source projects and internal tools.',
    responsibilities: [
      'Contribute to React core and related libraries',
      'Build innovative UI components and patterns',
      'Write technical documentation and tutorials',
      'Collaborate with the open-source community',
      'Participate in design discussions'
    ],
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Git'],
    preferredSkills: ['Open Source', 'Test-Driven Development', 'Performance Optimization'],
    location: 'Menlo Park, CA',
    workMode: 'On-site',
    duration: '12 weeks',
    stipend: '$8500/month',
    stipendAmount: 8500,
    applicationDeadline: new Date('2024-03-10'),
    openings: 10,
    category: 'Engineering',
    logo: 'https://logo.clearbit.com/meta.com'
  },
  {
    title: 'Node.js Developer Intern',
    company: 'Netflix',
    companyLogo: 'https://logo.clearbit.com/netflix.com',
    description: 'Build high-performance backend services that power the Netflix streaming platform. You will work on distributed systems and learn about scalability at massive scale.',
    responsibilities: [
      'Develop and maintain microservices using Node.js',
      'Work with event-driven architectures',
      'Implement API gateways and service meshes',
      'Optimize database queries and caching strategies',
      'Monitor and troubleshoot production systems'
    ],
    requiredSkills: ['Node.js', 'JavaScript', 'MongoDB', 'Redis'],
    preferredSkills: ['Kubernetes', 'Docker', 'GraphQL', 'AWS'],
    location: 'Los Gatos, CA',
    workMode: 'Remote',
    duration: '14 weeks',
    stipend: '$9000/month',
    stipendAmount: 9000,
    applicationDeadline: new Date('2024-03-25'),
    openings: 8,
    category: 'Engineering',
    logo: 'https://logo.clearbit.com/netflix.com'
  },
  {
    title: 'Backend Developer Intern',
    company: 'Amazon',
    companyLogo: 'https://logo.clearbit.com/amazon.com',
    description: 'Join Amazon\'s retail technology team to build and improve our e-commerce platform. You will work on high-impact projects that serve millions of customers daily.',
    responsibilities: [
      'Design and implement scalable backend services',
      'Build RESTful APIs and microservices',
      'Work with AWS services and infrastructure',
      'Implement data pipelines and analytics',
      'Ensure system reliability and security'
    ],
    requiredSkills: ['Java', 'Python', 'SQL', 'AWS'],
    preferredSkills: ['Spring Boot', 'Docker', 'Kubernetes', 'Lambda'],
    location: 'Seattle, WA',
    workMode: 'Hybrid',
    duration: '12 weeks',
    stipend: '$7000/month',
    stipendAmount: 7000,
    applicationDeadline: new Date('2024-03-18'),
    openings: 25,
    category: 'Engineering',
    logo: 'https://logo.clearbit.com/amazon.com'
  },
  {
    title: 'Java Developer Intern',
    company: 'Oracle',
    companyLogo: 'https://logo.clearbit.com/oracle.com',
    description: 'Work on enterprise software solutions and database technologies. You will gain deep knowledge of Java ecosystem and enterprise application development.',
    responsibilities: [
      'Develop enterprise applications using Java and Spring',
      'Work with Oracle Database and cloud services',
      'Implement microservices architecture',
      'Participate in code reviews and documentation',
      'Collaborate with global development teams'
    ],
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Maven'],
    preferredSkills: ['Hibernate', 'JPA', 'Oracle Cloud', 'Microservices'],
    location: 'Austin, TX',
    workMode: 'On-site',
    duration: '12 weeks',
    stipend: '$6500/month',
    stipendAmount: 6500,
    applicationDeadline: new Date('2024-03-22'),
    openings: 12,
    category: 'Engineering',
    logo: 'https://logo.clearbit.com/oracle.com'
  },
  {
    title: 'Data Analyst Intern',
    company: 'Spotify',
    companyLogo: 'https://logo.clearbit.com/spotify.com',
    description: 'Analyze user behavior and music trends to improve the Spotify experience. You will work with large datasets and build insights that drive product decisions.',
    responsibilities: [
      'Analyze user engagement and music consumption data',
      'Build dashboards and reports using SQL and visualization tools',
      'Collaborate with product and engineering teams',
      'Identify trends and patterns in user behavior',
      'Present findings to stakeholders'
    ],
    requiredSkills: ['SQL', 'Python', 'Excel', 'Data Visualization'],
    preferredSkills: ['Tableau', 'Power BI', 'Pandas', 'Statistics'],
    location: 'New York, NY',
    workMode: 'Hybrid',
    duration: '12 weeks',
    stipend: '$7200/month',
    stipendAmount: 7200,
    applicationDeadline: new Date('2024-03-28'),
    openings: 10,
    category: 'Data Science',
    logo: 'https://logo.clearbit.com/spotify.com'
  },
  {
    title: 'AI/ML Engineer Intern',
    company: 'OpenAI',
    companyLogo: 'https://logo.clearbit.com/openai.com',
    description: 'Work on cutting-edge artificial intelligence and machine learning projects. You will contribute to research and development of AI systems that push the boundaries of what\'s possible.',
    responsibilities: [
      'Develop and train machine learning models',
      'Work on natural language processing projects',
      'Implement model deployment and monitoring',
      'Collaborate with research scientists',
      'Optimize model performance and scalability'
    ],
    requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow'],
    preferredSkills: ['PyTorch', 'NLP', 'Computer Vision', 'MLOps'],
    location: 'San Francisco, CA',
    workMode: 'On-site',
    duration: '16 weeks',
    stipend: '$10000/month',
    stipendAmount: 10000,
    applicationDeadline: new Date('2024-03-30'),
    openings: 5,
    category: 'Data Science',
    logo: 'https://logo.clearbit.com/openai.com'
  },
  {
    title: 'UI/UX Design Intern',
    company: 'Airbnb',
    companyLogo: 'https://logo.clearbit.com/airbnb.com',
    description: 'Design beautiful and intuitive user experiences for millions of travelers and hosts. You will work on end-to-end design process from research to implementation.',
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity designs',
      'Conduct user research and usability testing',
      'Collaborate with product managers and engineers',
      'Contribute to design system and component library',
      'Design for multiple platforms and devices'
    ],
    requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    preferredSkills: ['Design Systems', 'Interaction Design', 'User Testing', 'CSS'],
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    duration: '12 weeks',
    stipend: '$6800/month',
    stipendAmount: 6800,
    applicationDeadline: new Date('2024-03-16'),
    openings: 8,
    category: 'Design',
    logo: 'https://logo.clearbit.com/airbnb.com'
  },
  {
    title: 'Software Developer Intern',
    company: 'Stripe',
    companyLogo: 'https://logo.clearbit.com/stripe.com',
    description: 'Build the financial infrastructure of the internet. You will work on high-scale systems that process millions of transactions daily and help shape the future of online payments.',
    responsibilities: [
      'Develop and maintain payment processing systems',
      'Build and optimize database schemas',
      'Implement API endpoints and webhooks',
      'Ensure system security and compliance',
      'Work with distributed systems at scale'
    ],
    requiredSkills: ['Go', 'Python', 'PostgreSQL', 'APIs'],
    preferredSkills: ['Distributed Systems', 'Docker', 'Kubernetes', 'Security'],
    location: 'Remote',
    workMode: 'Remote',
    duration: '14 weeks',
    stipend: '$9500/month',
    stipendAmount: 9500,
    applicationDeadline: new Date('2024-03-12'),
    openings: 12,
    category: 'Engineering',
    logo: 'https://logo.clearbit.com/stripe.com'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge');
    console.log('Connected to MongoDB');

    // Clear existing internships
    await Internship.deleteMany({});
    console.log('Cleared existing internships');

    // Insert new internships
    await Internship.insertMany(internships);
    console.log('Inserted 10 internship records');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
