import React from 'react';
import qs from 'qs';

import Sort, { list } from '../components/Sort';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import { Link } from 'react-router-dom';

import NotFound from './NotFound';
import { useSelector } from 'react-redux';
import { setCategoryId, setFilters } from '../redux/slices/filterSlice';
import { useNavigate } from 'react-router-dom';
import { fetchPizza } from '../redux/slices/pizzaSlice';
import { RootState, useAppDispatch } from '../redux/store';

export const Home = () => {
  const isSearch = React.useRef(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMounted = React.useRef(false);
  const { items, status } = useSelector((state: RootState) => state.pizza);
  const { categoryId, sort, searchValue } = useSelector((state: RootState) => state.filter);
  const sortType = sort.sortProperty;

  const onClickCategory = (id: number) => {
    dispatch(setCategoryId(id));
  };
  const getPizzas = async () => {
    const search = searchValue ? `&search=${searchValue}` : '';
    try {
      dispatch(
        fetchPizza({
          search,
          categoryId,
          sortType,
          sort,
          searchValue,
        }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      console.log('finally');
    }
  };

  type ParamsType = {
    searchValue: '';
    categoryId: number;
    name: string;
    sort: {
      name: string;
      sortProperty: 'rating' | 'title' | 'price';
    };
    sortProperty: 'rating' | 'title' | 'price';
  };
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as unknown as ParamsType;
      console.log('Params:', params);
      const sort = list.find((obj) => obj.sortProperty === params.sortProperty);
      console.log('Sort:', sort);
      if (sort) {
        params.sort = sort;
      }
      dispatch(setFilters(params));
      isSearch.current = true;
    }
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (!isSearch.current) {
      getPizzas();
    }
    isSearch.current = false;
  }, [categoryId, sortType, searchValue]);

  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort.sortProperty]);

  const skeletons = [...new Array(6)].map((_, i) => <Skeleton key={i} className="pizza-block" />);
  const pizzas = items.map((obj) => <PizzaBlock {...obj} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onClickCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {status === 'loading' ? skeletons : pizzas.length > 1 ? pizzas : <NotFound />}
      </div>
    </div>
  );
};

export default Home;
