'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts, getCategories } from './lib/api';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import { FilterByCategory, SortOptions, ResetFilters } from './components/FilterSort';
import Error from './error';
import Loading from './loading';

/**
 * Home component that fetches and displays a list of products.
 *
 * This component manages the state for product data, loading status, error handling,
 * and filter options. It also handles pagination and provides filtering and sorting
 * functionalities for the displayed products.
 *
 * @returns {JSX.Element} The main content of the home page including product grid, filters, and pagination.
 */
export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use the hook to get URL search parameters

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const limit = 20; // Number of products to display per page

  /**
   * Fetches products based on the current filter settings and updates the state.
   *
   * @async
   * @function fetchProducts
   */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ page, limit, search, category, sort });
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products whenever filters or pagination changes
  useEffect(() => {
    fetchProducts();
  }, [page, search, category, sort]);

  /**
   * Fetches categories for filtering products and updates the state.
   *
   * @async
   * @function fetchCategories
   */
  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        setError('Failed to fetch categories');
      }
    }

    fetchCategories();
  }, []);

  // Update the URL based on current filter settings
  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set('page', page.toString());
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);

    router.push(`/?${params.toString()}`, { scroll: false });
  }, [page, search, category, sort, router]);

  /**
   * Handles search input change.
   *
   * @param {string} newSearch - The new search query.
   */
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setPage(1);
  };

  /**
   * Handles category selection change.
   *
   * @param {string} newCategory - The new selected category.
   */
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  /**
   * Handles sort option change.
   *
   * @param {string} newSort - The new sort option.
   */
  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  /**
   * Resets all filters and pagination to their default states.
   */
  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setSort('');
    setPage(1);
  };

  const hasFilters = search || category || sort;

  if (error) {
    return <Error error={error} reset={fetchProducts} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">Explore the best store</h1>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
        <div className="w-full sm:w-auto">
          <SearchBar initialValue={search} onSearchChange={handleSearchChange} />
        </div>
        <div className="w-full sm:w-auto">
          <FilterByCategory
            categories={categories}
            selectedCategory={category}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <div className="w-full sm:w-auto">
          <SortOptions initialValue={sort} onSortChange={handleSortChange} />
        </div>
        {hasFilters && (
          <div className="w-full sm:w-auto">
            <ResetFilters onReset={handleResetFilters} />
          </div>
        )}
      </div>

      {/* Render the product grid and pagination controls */}
      <ProductGrid products={products} />
      <Pagination
        currentPage={page}
        hasMore={products.length === limit}
        onPageChange={setPage}
      />
    </div>
  );
}
