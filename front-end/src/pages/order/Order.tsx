import { useParams } from "react-router-dom"

const Order = () => {
    const id = useParams().id
  return (
    <div>{id}</div>
  )
}

export default Order