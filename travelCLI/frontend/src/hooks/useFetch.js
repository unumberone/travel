import { useState, useEffect } from 'react';

const useFetch = (url) => {
   const [data, setData] = useState([]);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         setError(null); // Xóa lỗi trước khi gọi API

         try {
            const res = await fetch(url);

            if (!res.ok) {
               throw new Error('Failed to fetch'); // Dừng nếu response không thành công
            }

            const result = await res.json();
            setData(result.data); // Đặt dữ liệu từ API
         } catch (error) {
            setError(error.message); // Đặt lỗi nếu có
         } finally {
            setLoading(false); // Dừng trạng thái loading
         }
      };

      fetchData();
   }, [url]);

   return {
      data,
      error,
      loading,
   };
};

export default useFetch;