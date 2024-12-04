export interface AuditTrail {
  audtId: number;
  user: string;
  table: string | null;
  action: string | null;
  timeStamp: string | null;
  status: 'active' | 'inactive';
}

export const auditTrailData: AuditTrail[] = [
  {
    audtId: 1,
    user: "John Doe",
    table: "Users",
    action: "Created new user",
    timeStamp: "2024-03-15T09:30:00Z",
    status: 'active'
  },
  {
    audtId: 2,
    user: "Jane Smith",
    table: "Products",
    action: "Updated product details",
    timeStamp: "2024-03-15T10:15:00Z",
    status: 'active'
  },
  {
    audtId: 3,
    user: "Mike Johnson",
    table: "Orders",
    action: "Deleted order",
    timeStamp: "2024-03-15T11:45:00Z",
    status: 'active'
  },
  {
    audtId: 4,
    user: "Sarah Wilson",
    table: "Inventory",
    action: "Modified stock levels",
    timeStamp: "2024-03-15T13:20:00Z",
    status: 'active'
  },
  {
    audtId: 5,
    user: "Robert Brown",
    table: "Settings",
    action: "Changed system configuration",
    timeStamp: "2024-03-15T14:55:00Z",
    status: 'active'
  },
  {
    audtId: 6,
    user: "Emily Davis",
    table: "Customers",
    action: "Updated customer information",
    timeStamp: "2024-03-15T15:30:00Z",
    status: 'active'
  }
];

export default auditTrailData;
