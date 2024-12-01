import React, { useEffect, useState } from "react";
import { getPublisher } from "../apis/publisher";
import { showToast } from "../utils/toastUtils";
import PublisherCard from "../components/publisher/PublisherCard";

const PublisherPage: React.FC = () => {
  const [publishers, setPublishers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPublishers = async (page: number) => {
    setLoading(true);
    try {
      const response = await getPublisher();
      const data = response.data.slice((page - 1) * 8, page * 8); // Paginate data
      setPublishers((prevPublishers) => [...prevPublishers, ...data]);
      setTotalPages(Math.ceil(response.data.length / 8));
    } catch (error) {
      showToast("Failed to fetch publishers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishers(page);
  }, [page]);

  const loadMorePublishers = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Các nhà xuất bản cộng tác với UTE Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {publishers.map((publisher) => (
          <PublisherCard
            key={publisher.id}
            id={publisher.id}
            name={publisher.name}
            address={publisher.address}
            books={publisher.books}
          />
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {page < totalPages && !loading && (
        <button
          onClick={loadMorePublishers}
          className="flex justify-between mx-auto mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default PublisherPage;