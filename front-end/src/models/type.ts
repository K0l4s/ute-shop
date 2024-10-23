export interface NotificationMessage {
  id: number;
  user_id: number;
  order_id: number | null;
  message: string;
  is_read: boolean;
  type: 'ORDER_UPDATE' | 'PROMOTION' | 'SYSTEM';
  createdAt: string;
}