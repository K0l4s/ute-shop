import { Link } from "react-router-dom"

const BlockPermissionPage = () => {
    const url = window.location.href;
    return (
        <section className="bg-white dark:bg-gray-900 min-w-screen min-h-screen
        text-center py-[10%] ">

            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600 ">KHÔNG CÓ QUYỀN</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Không thể truy cập.</p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Bạn không đủ quyền để truy cập trang có đường dẫn {url}! Hãy thử lại sau nhé!</p>
            <Link to="/" className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Quay về trang chủ</Link>

        </section>)
}

export default BlockPermissionPage