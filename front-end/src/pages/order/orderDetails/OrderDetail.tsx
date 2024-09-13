import { useParams } from "react-router-dom"


const OrderDetail = () => {
    const id = useParams().id;
  return (
    <div>Order id: {id}</div>
  )
}

export default OrderDetail