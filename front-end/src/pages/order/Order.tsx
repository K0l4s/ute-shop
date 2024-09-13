import { useParams } from "react-router-dom"

const Order = () => {
    const id = useParams().id
  return (
    <div>Xin chào {id}</div>
  )
}

export default Order