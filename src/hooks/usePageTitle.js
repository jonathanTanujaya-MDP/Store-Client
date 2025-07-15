import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const getPageTitle = (pathname) => {
            const routes = {
                '/': 'Dashboard - Manajemen Stock',
                '/products': 'Produk - Manajemen Stock',
                '/history': 'Riwayat Transaksi - Manajemen Stock',
                '/add-transaction': 'Tambah Transaksi - Manajemen Stock',
                '/restock': 'Restock Barang - Manajemen Stock',
                '/reports': 'Laporan - Manajemen Stock',
                '/stock-alerts': 'Peringatan Stock - Manajemen Stock',
            };

            return routes[pathname] || 'Manajemen Stock';
        };

        document.title = getPageTitle(location.pathname);
    }, [location.pathname]);
};

export default usePageTitle;
