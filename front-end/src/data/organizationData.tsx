
export interface Organization {
    id: number;
    name: string;
    email: string;
    type: string;
    lastActive: string;
  }
  
  // Sample data array that matches the Organization interface
  const sampleData: Organization[] = [
    { id: 1, name: 'Organization1', email: 'org1@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
    { id: 1, name: 'Organization1', email: 'org1@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
    { id: 1, name: 'Organization1', email: 'org1@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
    { id: 1, name: 'Organization1', email: 'org1@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
    { id: 1, name: 'Organization1', email: 'org1@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
    { id: 2, name: 'Organization2', email: 'org2@example.com', type: 'Finance', lastActive: 'Oct 7, 2024' },
    
  ];
  
  export default sampleData;
  