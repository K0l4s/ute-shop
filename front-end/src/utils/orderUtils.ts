export const formatStatus = (status: String) => {
  switch (status) {
    case 'PENDING':
      return 'Chờ xác nhận';
    case 'CONFIRMED':
      return 'Đã xác nhận';
    case 'PROCESSING':
      return 'Đang xử lý';
    case 'DELIVERED':
      return 'Đang giao hàng';
    case 'SHIPPED':
      return 'Đã giao hàng';
    case 'CANCELLED':
      return 'Đã hủy';
    case 'RETURNED':
      return 'Đã trả hàng';
    default:
      return status;
  }
};