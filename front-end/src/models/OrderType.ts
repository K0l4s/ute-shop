export interface Category {
  name: string;
}

export interface Book {
    id: number;
    title: string;
    price: string;
    category: Category;
    cover_img_url: string;
  }
  
  export interface OrderDetail {
    book: Book;
    quantity: number;
    price: string;
  }
  
  export interface Order {
    id: number;
    order_date: string;
    shipping_address: string;
    shipping_method: 'STANDARD' | 'EXPRESS';
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
    total_price: string;
    updatedAt: string;
    orderDetails: OrderDetail[];
  }
  