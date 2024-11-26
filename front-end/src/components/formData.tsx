export interface Form {
  templateId: number;
  name: string;
  category: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// Sample data array with unique entries
const sampleFormData: Form[] = [
  {
    templateId: 1,
    name: 'Sales Overview',
    category: 'Sales',
    createdDate: 'Oct 1, 2024',
    createdBy: 'Adheeb Ahmed',
    lastModifiedDate: 'Oct 2, 2024',
    lastModifiedBy: 'Minhaj Naseer',
  },
  {
    templateId: 2,
    name: 'Customer Feedback',
    category: 'Customer Service',
    createdDate: 'Sep 28, 2024',
    createdBy: 'John Doe',
    lastModifiedDate: 'Oct 1, 2024',
    lastModifiedBy: 'Jane Smith',
  },
  {
    templateId: 3,
    name: 'Expense Tracker',
    category: 'Finance',
    createdDate: 'Sep 15, 2024',
    createdBy: 'Sara Lee',
    lastModifiedDate: 'Sep 20, 2024',
    lastModifiedBy: 'Chris Evans',
  },
  {
    templateId: 4,
    name: 'Employee Satisfaction',
    category: 'HR',
    createdDate: 'Aug 30, 2024',
    createdBy: 'Emily Clark',
    lastModifiedDate: 'Sep 1, 2024',
    lastModifiedBy: 'David Brown',
  },
  {
    templateId: 5,
    name: 'Marketing Campaign Analysis',
    category: 'Marketing',
    createdDate: 'Oct 3, 2024',
    createdBy: 'Mia Johnson',
    lastModifiedDate: 'Oct 4, 2024',
    lastModifiedBy: 'Oliver King',
  },
  {
    templateId: 6,
    name: 'IT Incident Report',
    category: 'IT',
    createdDate: 'Sep 10, 2024',
    createdBy: 'Lucas Adams',
    lastModifiedDate: 'Sep 12, 2024',
    lastModifiedBy: 'Sophia Wilson',
  },
  {
    templateId: 7,
    name: 'Product Launch Checklist',
    category: 'Operations',
    createdDate: 'Oct 5, 2024',
    createdBy: 'Noah Davis',
    lastModifiedDate: 'Oct 6, 2024',
    lastModifiedBy: 'Emma Thomas',
  },
];

export default sampleFormData;
