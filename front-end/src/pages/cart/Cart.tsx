import React, { useEffect, useState } from "react";
import CartItems from "../../components/cart/cartItems/CartItems"
import DiscountCode from "../../components/voucher/DiscountCode";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { removeItem, updateQuantity, toggleCheck, toggleSelectAll, setItems } from "../../redux/reducers/cartSlice";
import { useNavigate } from "react-router-dom";
import { encodeCartData, getUserCart, removeFromCart, toggleCheckAllStatus, toggleCheckStatus, updateCartItem } from "../../apis/cart";
import { showToast } from "../../utils/toastUtils";

const Cart: React.FC = () => {
  // Lấy item từ store
  const books = useSelector((state: RootState) => state.cart.items);
  const selectedDiscountVoucherId = useSelector((state: RootState) => state.voucher.selectedDiscountVoucherId);
  const availableVouchers = useSelector((state: RootState) => state.voucher.availableVouchers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);

  //Gọi API để lấy giỏ hàng khi component được mount
  useEffect(() => {
    const fetchCart = async () => {
      try{
        const response = await getUserCart();
        const cartItems = response.data.map((item:any) => ({
          id: item.book.id,
          title: item.book.title,
          price: parseFloat(item.book.price),
          salePrice: item.book.salePrice ? parseFloat(item.book.salePrice) : undefined,
          image: item.book.cover_img_url,
          stars: item.book.stars || 0,
          age: item.book.age || '',
          publisher: item.book.publisher || '',
          quantity: item.quantity,
          stock: item.book.stock,
          checked: item.checked,
        }));
        dispatch(setItems(cartItems));

        const allChecked = cartItems.every((item: any) => item.checked);
        setSelectAll(allChecked);
      } catch(error){
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [dispatch]);
  
  // Hàm để cập nhật số lượng sách
  const handleQuantityChange = async (id: number, delta: number) => {
    const book = books.find((book) => book.id === id);
    if (book) {
      const newQuantity = Math.max(1, book.quantity + delta);
      try{
        await updateCartItem(id, newQuantity); // Gọi API để cập nhật số lượng
        dispatch(updateQuantity({ id, quantity: newQuantity }));
      } catch(error){
        console.error("Failed to update quantity:", error);
      }
    }
  };

  // Cập nhật trạng thái checked của từng sách
  const handleCheckboxChange = async (id: number) => {
    dispatch(toggleCheck(id));
    await toggleCheckStatus(id);
    
    const allChecked = books.every((book) => book.checked || book.id === id );
    setSelectAll(allChecked);
    if (selectAll) {
      setSelectAll(false);
    }
  };

  // Cập nhật trạng thái chọn tất cả
  const handleSelectAll = async () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    dispatch(toggleSelectAll(newSelectAll));
    await toggleCheckAllStatus();
  };

  // Hàm xóa sách khỏi giỏ hàng
  const handleRemoveBook = async (id: number) => {
    try{
      await removeFromCart(id);
      dispatch(removeItem(id));
      showToast("Đã xóa khỏi giỏ hàng", "success");
    } catch(error){
      console.error("Failed to remove book from cart:", error);
    }
  };
  
  const handleDirectToProductPage = async (id: number) => {
    window.location.href = `/products/${id}`;
  };

  // Tính tổng tiền dựa trên các sách đã checked
  const totalPrice = books.reduce((total, book) => {
    if (book.checked) {
      return total + (book.salePrice || book.price) * book.quantity;
    }
    return total;
  }, 0);


  // Lấy thông tin voucher đã chọn
  const selectedDiscountVoucher = availableVouchers.find(voucher => voucher.id === selectedDiscountVoucherId && voucher.type === 'discount');

  // Tính toán lại tổng tiền sau khi áp dụng discount
  const discountAmount = selectedDiscountVoucher ? (selectedDiscountVoucher.discount_val || (selectedDiscountVoucher.discount_perc / 100) * totalPrice) : 0;
  const finalTotalPrice = totalPrice - discountAmount;

  // Kiểm tra xem có sách nào được check không
  const isAnyBookChecked = books.some((book) => book.checked);
  
  const handleCheckout = async () => {
    if (!isAnyBookChecked) {
      showToast("Không có sản phẩm nào được chọn để thanh toán", "error");
      return;
    }
    
    const selectedItems = books.filter(book => book.checked);
    const shipping_method = "STANDARD";
    const payment_method = "COD";

    //  const totalAmount = totalPrice; 

    const totalAmount = finalTotalPrice;


    try {
      const response = await encodeCartData({ selectedItems, shipping_method, payment_method, totalAmount});
      const encodedData = response.data.encryptedData;
      navigate(`/checkout?data=${encodeURIComponent(encodedData)}`);
    } catch (error) {
      console.error("Failed to encode cart data:", error);
    }

  };
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex max-w-7xl mx-auto">
        {/* Cart Items Section */}
        <div className="w-2/3 p-4 bg-white mr-4 rounded shadow-lg">
          <h1 className="text-xl font-bold mb-4 text-violet-700">GIỎ HÀNG ({books.length} sản phẩm)</h1>

          {/* Header Cart */}
          <div className="flex items-center justify-between font-bold w-full">
            <div className="w-3/5 flex items-center">
              <input 
                type="checkbox" 
                className="mr-4 w-5 h-5" 
                checked={selectAll}
                onChange={handleSelectAll}/>
              <h2 className="">Chọn tất cả</h2>
            </div>
            <div className="w-2/5 flex items-center justify-evenly">
              <h2 className="">Số lượng</h2>
              <h2 className="">Thành tiền</h2>
            </div>
          </div>
          
          {books.length === 0 ? (
            <div className="w-full flex justify-center items-center mt-2">
              <img src="./suchEmpty.jpeg" alt="Empty Cart" className="w-full h-auto rounded" />
            </div>
          ) : (
            <>
            {/* Cart Items */}
            <div className="border-t border-gray-200 mt-2">
              <CartItems 
                books={books} 
                onQuantityChange={handleQuantityChange} 
                onCheckboxChange={handleCheckboxChange}
                onRemoveBook={handleRemoveBook}
                onDirectToProduct={handleDirectToProductPage} />
            </div>
            </>
          )}
          
        </div>

        <div className="w-1/3">
          {/* Discount code section */}
          <DiscountCode />

          {/* Total Price Section */}
          <div className="mt-4 p-4 rounded bg-white shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-violet-700">THÀNH TIỀN</h2>
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Tổng số tiền</span>
              <span className="font-bold text-red-500">{finalTotalPrice.toLocaleString()} đ</span>
            </div>
            <button 
              className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700"
              onClick={handleCheckout}
              disabled={!isAnyBookChecked}>
              THANH TOÁN
            </button>
            <p className="text-sm text-red-500 mt-2">Giá tiền chưa tính phí vận chuyển</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;