export interface Template {
    id: number;
    name: string;
    category: string;
    createdDate: string;
    createdBy: string;
    lastModifiedDate: string;
    lastModifiedBy: string;
  }
  
  // Sample data array that matches the Template interface
  const sampleTemplateData: Template[] = [
    {
      id: 1,
      name: 'TempName 1',
      category: 'Sales',
      createdDate: 'Oct 6, 2024',
      createdBy: 'Adheeb Ahmed',
      lastModifiedDate: 'Oct 6, 2024',
      lastModifiedBy: 'Minhaj Naseer',
    },
    {
      id: 2,
      name: 'TempName 2',
      category: 'Sales',
      createdDate: 'Oct 6, 2024',
      createdBy: 'Adheeb Ahmed',
      lastModifiedDate: 'Oct 6, 2024',
      lastModifiedBy: 'Minhaj Naseer',
    },
    {
      id: 3,
      name: 'TempName 3',
      category: 'Sales',
      createdDate: 'Oct 6, 2024',
      createdBy: 'Adheeb Ahmed',
      lastModifiedDate: 'Oct 6, 2024',
      lastModifiedBy: 'Minhaj Naseer',
    },
    {
      id: 4,
      name: 'TempName 4',
      category: 'Sales',
      createdDate: 'Oct 6, 2024',
      createdBy: 'Adheeb Ahmed',
      lastModifiedDate: 'Oct 6, 2024',
      lastModifiedBy: 'Minhaj Naseer',
    },
  ];
  
  export default sampleTemplateData;
  