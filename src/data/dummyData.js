export const user = {
  id: 1,
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  phone: "+1 (555) 123-4567",
  college: "Tech University",
  degree: "Bachelor of Technology",
  branch: "Computer Science",
  graduationYear: 2025,
  about: "Passionate software developer with expertise in web development and cloud technologies. Eager to apply my skills in a dynamic internship environment.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  profileCompletion: 75
};

export const skills = [
  { id: 1, name: "JavaScript", level: 90, category: "Programming" },
  { id: 2, name: "React.js", level: 85, category: "Frontend" },
  { id: 3, name: "Node.js", level: 75, category: "Backend" },
  { id: 4, name: "Python", level: 80, category: "Programming" },
  { id: 5, name: "MongoDB", level: 70, category: "Database" },
  { id: 6, name: "CSS/Tailwind", level: 85, category: "Frontend" },
  { id: 7, name: "Git", level: 80, category: "Tools" },
  { id: 8, name: "REST APIs", level: 75, category: "Backend" }
];

export const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Features include user authentication, product management, cart functionality, and payment integration.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://github.com/alexjohnson/ecommerce"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Developed a collaborative task management application with real-time updates using Socket.io. Includes team workspaces, task assignments, and progress tracking.",
    technologies: ["React", "Node.js", "Socket.io", "Express"],
    link: "https://github.com/alexjohnson/taskmanager"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Created a weather dashboard that displays current conditions and forecasts for multiple cities. Integrates with OpenWeatherMap API and provides beautiful visualizations.",
    technologies: ["React", "Chart.js", "OpenWeatherMap API"],
    link: "https://github.com/alexjohnson/weatherapp"
  }
];

export const certifications = [
  {
    id: 1,
    name: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    date: "July 2024",
    credentialId: "AWS-12345678"
  },
  {
    id: 2,
    name: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta",
    date: "March 2024",
    credentialId: "META-87654321"
  },
  {
    id: 3,
    name: "Google Cloud Associate Cloud Engineer",
    issuer: "Google Cloud",
    date: "December 2023",
    credentialId: "GCP-11223344"
  }
];

export const internships = [
  {
    id: 1,
    company: "Google",
    title: "Software Engineering Intern",
    location: "Mountain View, CA",
    workMode: "On-site",
    duration: "12 weeks",
    stipend: "$8000/month",
    description: "Join our engineering team to work on core infrastructure projects. You'll collaborate with experienced engineers to build scalable systems that impact millions of users.",
    responsibilities: [
      "Design and implement new features for Google's core products",
      "Collaborate with cross-functional teams in a fast-paced environment",
      "Participate in code reviews and architectural discussions",
      "Contribute to open-source projects"
    ],
    requiredSkills: ["JavaScript", "Python", "System Design", "Data Structures"],
    postedDate: "2024-01-15",
    logo: "https://logo.clearbit.com/google.com"
  },
  {
    id: 2,
    company: "Microsoft",
    title: "Frontend Developer Intern",
    location: "Remote",
    workMode: "Remote",
    duration: "16 weeks",
    stipend: "$7500/month",
    description: "Work on cutting-edge web technologies and contribute to Microsoft's web platforms. Focus on creating responsive, accessible, and performant user interfaces.",
    responsibilities: [
      "Build modern web applications using React and TypeScript",
      "Implement responsive designs and accessibility features",
      "Optimize web performance and user experience",
      "Work with design teams to implement pixel-perfect UIs"
    ],
    requiredSkills: ["React", "TypeScript", "CSS", "Accessibility"],
    postedDate: "2024-01-10",
    logo: "https://logo.clearbit.com/microsoft.com"
  },
  {
    id: 3,
    company: "Amazon",
    title: "Full Stack Developer Intern",
    location: "Seattle, WA",
    workMode: "Hybrid",
    duration: "12 weeks",
    stipend: "$7000/month",
    description: "Join Amazon's retail technology team to build and improve our e-commerce platform. Work on high-impact projects that serve millions of customers.",
    responsibilities: [
      "Develop and maintain full-stack applications",
      "Build RESTful APIs and microservices",
      "Implement CI/CD pipelines and automated testing",
      "Collaborate with product managers and designers"
    ],
    requiredSkills: ["React", "Node.js", "AWS", "GraphQL"],
    postedDate: "2024-01-08",
    logo: "https://logo.clearbit.com/amazon.com"
  },
  {
    id: 4,
    company: "Meta",
    title: "React Developer Intern",
    location: "Menlo Park, CA",
    workMode: "On-site",
    duration: "12 weeks",
    stipend: "$8500/month",
    description: "Work on Meta's open-source React ecosystem and contribute to products used by billions. Help shape the future of web development.",
    responsibilities: [
      "Contribute to React core and related libraries",
      "Build innovative UI components and patterns",
      "Collaborate with the React team at Meta",
      "Write technical documentation and tutorials"
    ],
    requiredSkills: ["React", "JavaScript", "TypeScript", "Open Source"],
    postedDate: "2024-01-05",
    logo: "https://logo.clearbit.com/meta.com"
  },
  {
    id: 5,
    company: "Stripe",
    title: "Backend Engineering Intern",
    location: "Remote",
    workMode: "Remote",
    duration: "14 weeks",
    stipend: "$9000/month",
    description: "Build the financial infrastructure of the internet. Work on high-scale systems that process millions of transactions daily.",
    responsibilities: [
      "Design and implement payment processing systems",
      "Build and optimize database schemas",
      "Develop API endpoints for merchant integrations",
      "Ensure system reliability and security"
    ],
    requiredSkills: ["Go", "Python", "PostgreSQL", "Distributed Systems"],
    postedDate: "2024-01-03",
    logo: "https://logo.clearbit.com/stripe.com"
  },
  {
    id: 6,
    company: "Spotify",
    title: "Data Engineering Intern",
    location: "New York, NY",
    workMode: "Hybrid",
    duration: "12 weeks",
    stipend: "$7500/month",
    description: "Work on Spotify's data infrastructure and help deliver personalized music experiences to millions of users worldwide.",
    responsibilities: [
      "Build data pipelines and ETL processes",
      "Implement data quality checks and monitoring",
      "Optimize data storage and retrieval systems",
      "Collaborate with data science teams"
    ],
    requiredSkills: ["Python", "SQL", "Spark", "Airflow"],
    postedDate: "2024-01-01",
    logo: "https://logo.clearbit.com/spotify.com"
  }
];

export const applications = [
  {
    id: 1,
    internshipId: 1,
    internshipTitle: "Software Engineering Intern",
    company: "Google",
    appliedDate: "2024-01-16",
    status: "Under Review"
  },
  {
    id: 2,
    internshipId: 2,
    internshipTitle: "Frontend Developer Intern",
    company: "Microsoft",
    appliedDate: "2024-01-12",
    status: "Shortlisted"
  },
  {
    id: 3,
    internshipId: 3,
    internshipTitle: "Full Stack Developer Intern",
    company: "Amazon",
    appliedDate: "2024-01-09",
    status: "Applied"
  },
  {
    id: 4,
    internshipId: 5,
    internshipTitle: "Backend Engineering Intern",
    company: "Stripe",
    appliedDate: "2024-01-04",
    status: "Rejected"
  }
];

export const savedInternships = [2, 4, 6];

export const stats = {
  applications: applications.length,
  savedInternships: savedInternships.length,
  skills: skills.length,
  profileCompletion: user.profileCompletion
};
