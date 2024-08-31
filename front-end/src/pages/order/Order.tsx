import { useParams } from "react-router-dom"

const Order = () => {
    const id = useParams().id
  return (
    <div>Order</div>
  )
}

export default Order