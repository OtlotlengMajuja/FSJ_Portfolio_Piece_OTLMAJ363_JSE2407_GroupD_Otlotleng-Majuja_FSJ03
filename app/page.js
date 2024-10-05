'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts, getCategories } from './lib/api';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import { FilterByCategory, SortOptions, ResetFilters } from './components/FilterSort';
import Error from './error';
import Loading from './loading';
import { debounce } from 'lodash';

/**
 * Home component that fetches and displays a list of products.
 *
 * This component manages the state for product data, loading status, error handling,
 * and filter options. It also handles pagination and provides filtering and sorting
 * functionalities for the displayed products.
 *
 * @returns {JSX.Element} The main content of the home page including product grid, filters, and pagination.
 */
export default function Home({
  initialProducts,
  initialCategories,
  initialPage,
  initialSearch,
  initialCategory,
  initialSort,
  error: initialError
}) {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use the hook to get URL search parameters

  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState(initialError);
  const [categories, setCategories] = useState(initialCategories || []);

  const [page, setPage] = useState(initialPage || 1);
  const [search, setSearch] = useState(initialSearch || '');
  const [category, setCategory] = useState(initialCategory || '');
  const [sort, setSort] = useState(initialSort || '');

  const [totalPages, setTotalPages] = useState(1);

  const limit = 20; // Number of products to display per page

  const fetchProducts = useCallback(async (searchTerm, pageNum) => {
    setLoading(true);
    try {
      const data = await getProducts({ page: pageNum, limit, search: searchTerm, category, sort });
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, sort]);

  const debouncedFetchProducts = useCallback(
    debounce((searchTerm, pageNum) => fetchProducts(searchTerm, pageNum), 300),
    [fetchProducts]
  );

  useEffect(() => {
    debouncedFetchProducts(search, page);
  }, [debouncedFetchProducts, search, page, category, sort]);

  useEffect(() => {
    fetchProducts(search);
  }, [fetchProducts, page, category, sort, search]);

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

    if (!initialCategories) {
      fetchCategories();
    }
  }, [initialCategories]);

  const updateURL = useCallback(
    debounce((newParams) => {
      const params = new URLSearchParams(newParams);
      router.push(`/?${params.toString()}`, { scroll: false });
    }, 500),
    [router]
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set('page', page.toString());
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);

    updateURL(params);
  }, [page, search, category, sort, updateURL]);

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
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
    return <Error error={error} reset={fetchProducts(search, page)} />;
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
      <ProductGrid products={products || []} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        hasMore={products.length === limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
