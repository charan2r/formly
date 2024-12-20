export interface AuditTrail {
  id: string;
  user: string;
  tableName: string;
  action: string;
  createdAt: string;
  // Add other fields as necessary
}
