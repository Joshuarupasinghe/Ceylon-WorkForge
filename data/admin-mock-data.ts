// Mock data for admin dashboard
export const MOCK_USERS = [
  {
    id: "1",
    name: "Amal Perera",
    email: "amal@example.com",
    role: "user",
    userType: "seeker",
    status: "active",
    isPaid: true,
    joinedAt: "2023-10-15",
  },
  {
    id: "2",
    name: "Priya Jayawardena",
    email: "priya@example.com",
    role: "user",
    userType: "seeker",
    status: "active",
    isPaid: true,
    joinedAt: "2023-11-02",
  },
  {
    id: "3",
    name: "Malik Fernando",
    email: "malik@example.com",
    role: "user",
    userType: "seeker",
    status: "pending",
    isPaid: false,
    joinedAt: "2023-12-10",
  },
  {
    id: "4",
    name: "TechCorp Lanka",
    email: "hr@techcorp.lk",
    role: "user",
    userType: "poster",
    status: "active",
    isPaid: true,
    joinedAt: "2023-09-20",
  },
  {
    id: "5",
    name: "Creative Solutions",
    email: "jobs@creative.lk",
    role: "user",
    userType: "poster",
    status: "active",
    isPaid: true,
    joinedAt: "2023-10-05",
  },
  {
    id: "6",
    name: "Global Brands Lanka",
    email: "careers@globalbrands.lk",
    role: "user",
    userType: "poster",
    status: "pending",
    isPaid: false,
    joinedAt: "2023-12-15",
  },
]

export const MOCK_JOBS = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Lanka",
    location: "Colombo",
    status: "active",
    applications: 12,
    postedAt: "2023-11-10",
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Creative Solutions",
    location: "Colombo",
    status: "active",
    applications: 8,
    postedAt: "2023-11-15",
  },
  {
    id: "3",
    title: "Marketing Manager",
    company: "Global Brands Lanka",
    location: "Kandy",
    status: "pending",
    applications: 0,
    postedAt: "2023-12-18",
  },
  {
    id: "4",
    title: "Data Analyst",
    company: "DataTech Solutions",
    location: "Colombo",
    status: "active",
    applications: 5,
    postedAt: "2023-12-05",
  },
  {
    id: "5",
    title: "Frontend Developer",
    company: "WebSolutions Lanka",
    location: "Galle",
    status: "active",
    applications: 7,
    postedAt: "2023-12-01",
  },
]

export const MOCK_REPORTS = [
  {
    id: "1",
    type: "user",
    reportedId: "3",
    reportedName: "Malik Fernando",
    reason: "Inappropriate behavior in messages",
    status: "pending",
    reportedAt: "2023-12-15",
  },
  {
    id: "2",
    type: "job",
    reportedId: "3",
    reportedName: "Marketing Manager",
    reason: "Misleading job description",
    status: "pending",
    reportedAt: "2023-12-17",
  },
  {
    id: "3",
    type: "user",
    reportedId: "6",
    reportedName: "Global Brands Lanka",
    reason: "Spam job postings",
    status: "resolved",
    reportedAt: "2023-12-10",
  },
]

// Mock data for job seekers
export const MOCK_JOB_SEEKERS = [
  {
    id: "1",
    name: "Amal Perera",
    email: "amal@example.com",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    experience: "3 years",
    education: "BSc Computer Science",
    status: "active",
    applications: 8,
    joinedAt: "2023-10-15",
  },
  {
    id: "2",
    name: "Priya Jayawardena",
    email: "priya@example.com",
    skills: ["UI/UX Design", "Figma", "Adobe XD", "HTML/CSS"],
    experience: "5 years",
    education: "BA Design",
    status: "active",
    applications: 4,
    joinedAt: "2023-11-02",
  },
  {
    id: "3",
    name: "Malik Fernando",
    email: "malik@example.com",
    skills: ["Python", "Data Analysis", "SQL", "Tableau"],
    experience: "2 years",
    education: "MSc Data Science",
    status: "pending",
    applications: 0,
    joinedAt: "2023-12-10",
  },
  {
    id: "4",
    name: "Nimal Gunaratne",
    email: "nimal@example.com",
    skills: ["Java", "Spring Boot", "Microservices", "AWS"],
    experience: "7 years",
    education: "BSc Software Engineering",
    status: "active",
    applications: 3,
    joinedAt: "2023-09-05",
  },
  {
    id: "5",
    name: "Kumari Silva",
    email: "kumari@example.com",
    skills: ["Content Writing", "SEO", "Social Media", "Marketing"],
    experience: "4 years",
    education: "BA English Literature",
    status: "active",
    applications: 6,
    joinedAt: "2023-10-20",
  },
  {
    id: "6",
    name: "Rajiv Mendis",
    email: "rajiv@example.com",
    skills: ["Project Management", "Agile", "Scrum", "JIRA"],
    experience: "8 years",
    education: "MBA",
    status: "pending",
    applications: 0,
    joinedAt: "2023-12-15",
  },
]

// Mock data for featured listings
export const MOCK_FEATURED_LISTINGS = [
  {
    id: "1",
    jobId: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Lanka",
    location: "Colombo, Sri Lanka",
    jobType: "Full-time",
    description:
      "We're looking for an experienced software engineer to join our growing team. You'll be working on cutting-edge projects using the latest technologies.",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    featuredFrom: new Date(2023, 11, 1), // December 1, 2023
    featuredUntil: new Date(2023, 11, 31), // December 31, 2023
    status: "active" as const,
    views: 1245,
    clicks: 87,
  },
  {
    id: "2",
    jobId: "2",
    title: "UX/UI Designer",
    company: "Creative Solutions",
    location: "Colombo, Sri Lanka",
    jobType: "Full-time",
    description:
      "Join our creative team to design beautiful and intuitive user interfaces for web and mobile applications. You'll be working closely with developers and product managers.",
    skills: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
    featuredFrom: new Date(2023, 11, 10), // December 10, 2023
    featuredUntil: new Date(2024, 0, 10), // January 10, 2024
    status: "active" as const,
    views: 980,
    clicks: 65,
  },
  {
    id: "3",
    jobId: "4",
    title: "Data Analyst",
    company: "DataTech Solutions",
    location: "Colombo, Sri Lanka",
    jobType: "Full-time",
    description:
      "We are seeking a skilled Data Analyst to interpret data and turn it into information which can offer ways to improve our business, products and services.",
    skills: ["SQL", "Python", "Data Visualization", "Excel"],
    featuredFrom: new Date(2023, 10, 15), // November 15, 2023
    featuredUntil: new Date(2023, 11, 15), // December 15, 2023
    status: "expired" as const,
    views: 1560,
    clicks: 102,
  },
  {
    id: "4",
    jobId: "5",
    title: "Frontend Developer",
    company: "WebSolutions Lanka",
    location: "Galle, Sri Lanka",
    jobType: "Remote",
    description:
      "Looking for a talented Frontend Developer to create responsive and interactive web applications. You'll be working with modern JavaScript frameworks.",
    skills: ["JavaScript", "React", "HTML", "CSS", "Responsive Design"],
    featuredFrom: new Date(2024, 0, 1), // January 1, 2024
    featuredUntil: new Date(2024, 0, 31), // January 31, 2024
    status: "scheduled" as const,
    views: 0,
    clicks: 0,
  },
]

// Available jobs for featuring (active jobs that aren't currently featured)
export const AVAILABLE_JOBS_FOR_FEATURING = [
  {
    id: "3",
    title: "Marketing Manager",
    company: "Global Brands Lanka",
    location: "Kandy, Sri Lanka",
    jobType: "Full-time",
    description:
      "We're looking for a Marketing Manager to lead our marketing efforts and develop strategies to increase brand awareness and drive customer engagement.",
    skills: ["Digital Marketing", "Social Media", "Content Strategy", "Analytics"],
  },
  // Additional jobs that could be featured
  {
    id: "6",
    title: "DevOps Engineer",
    company: "CloudTech Lanka",
    location: "Colombo, Sri Lanka",
    jobType: "Full-time",
    description:
      "Join our team to build and maintain our cloud infrastructure. You'll be responsible for deployment, monitoring, and optimization of our systems.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
  },
  {
    id: "7",
    title: "Product Manager",
    company: "Innovate Solutions",
    location: "Colombo, Sri Lanka",
    jobType: "Full-time",
    description:
      "We're seeking a Product Manager to define product vision, strategy and roadmap. You'll work closely with engineering, design, and marketing teams.",
    skills: ["Product Strategy", "User Research", "Agile", "Roadmapping"],
  },
  {
    id: "8",
    title: "Content Writer",
    company: "Digital Media Agency",
    location: "Remote",
    jobType: "Part-time",
    description:
      "Looking for a talented Content Writer to create engaging content for our clients across various industries. Strong writing skills and creativity required.",
    skills: ["Copywriting", "SEO", "Blogging", "Editing", "Research"],
  },
]
