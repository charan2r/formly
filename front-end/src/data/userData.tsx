export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    lastActive: string;
  }
  
  // Sample data array that matches the User interface
  const sampleUserData: User[] = [
    { id: 1, name: 'User1', email: 'user1@example.com', role: 'Admin', lastActive: 'Oct 6, 2024' },
    { id: 2, name: 'User2', email: 'user2@example.com', role: 'Editor', lastActive: 'Oct 7, 2024' },
    { id: 3, name: 'User3', email: 'user3@example.com', role: 'Viewer', lastActive: 'Oct 8, 2024' },
    { id: 4, name: 'User4', email: 'user4@example.com', role: 'Contributor', lastActive: 'Oct 9, 2024' },
    { id: 5, name: 'User5', email: 'user5@example.com', role: 'Admin', lastActive: 'Oct 10, 2024' },
    { id: 6, name: 'User6', email: 'user6@example.com', role: 'Viewer', lastActive: 'Oct 11, 2024' },
  ];
  
  export default sampleUserData;
  