import CartItems from "../../components/cart/cartItems/CartItems"

const Cart = () => {
    const items = [
        {
            id: 1,
            name: "Product 1",
            price: 100,
            quantity: 2
        },
        {
            id: 2,
            name: "Product 2",
            price: 200,
            quantity: 7
        },
        {
            id: 2,
            name: "Product 2",
            price: 200,
            quantity: 5
        },
        {
            id: 2,
            name: "Product 2",
            price: 200,
            quantity: 1
        },
        {
            id: 2,
            name: "Product 2",
            price: 200,
            quantity: 1
        }
    ]
    return (
        <div className=" mt-10 ml-20 mr-20">
            <h1 className="text-xl font-bold">Giỏ hàng</h1>
            
            {/* foreach */}
            {items.map((item) => (
                <CartItems {...item} />
            ))}
        </div>
    )
}

export default Cart