const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">About UTEShop</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
            UTEShop là một nền tảng trực tuyến cung cấp nhiều loại sách và tài liệu giáo dục. Sứ mệnh của chúng tôi là giúp việc học trở nên dễ tiếp cận và thú vị cho mọi người.
            </p>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Members</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                Huynh Trung Kien - <a href="https://github.com/K0l4s" className="hover:underline">GitHub</a>
              </li>
              <li className="mb-4">
                Ngo Minh Thuan - <a href="https://github.com/nauht1" className="hover:underline">GitHub</a>
              </li>
              <li className="mb-4">
                Nguyen The Thanh - <a href="https://github.com/thanhnt932" className="hover:underline">GitHub</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Contact</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="mailto:uteshop.st@gmail.com" className="hover:underline">uteshop.st@gmail.com</a>
              </li>
              <li className="mb-4">
                <a href="https://github.com/K0l4s/ute-shop" className="hover:underline">GitHub</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-6 text-center">
          &copy; 2024 UTEShop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;