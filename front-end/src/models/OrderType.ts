export interface Category {
  name: string;
}

export interface Book {
    id: number;
    title: string;
    price: string;
    category: Category;
    cover_img_url: string;
    stock?: number;
  }
  
  export interface OrderDetail {
    book: Book;
    quantity: number;
    price: string;
  }
  
  export interface OrderTracking {
    confirmedAt: string,
    processedAt: string,
    deliveredAt: string,
    shippedAt: string,
    canceledAt: string,
    returnedAt: string
  }

  export interface Payment {
    payment_date: string;
    payment_method: 'COD' | 'VNPAY';
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
  }

  export interface Discount {
    code: string;
    discount_val: string;
    discount_perc: string;
  }

  export interface Freeship {
    code: string;
    discount_val: string;
    discount_perc: string;
  }
  export interface Order {
    id: number;
    user_id: number;
    freeship_id: number | null;
    discount_id: number | null;
    order_date: string;
    shipping_address: string;
    shipping_method: 'STANDARD' | 'EXPRESS';
    shipping_fee: number;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
    total_price: string;
    updatedAt: string;
    orderTracking: OrderTracking
    orderDetails: OrderDetail[];
    payment: Payment;
    discount: Discount;
    freeship: Freeship;
    coins_used: number;
    isReviewed: boolean;
  }
  