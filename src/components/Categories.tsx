import React from 'react';

type CategoriesProps = {
  value: number;
  onClickCategory: (i: number) => void; //void-коли,функція повертає undefined;
};

const Categories: React.FC<CategoriesProps> = ({ value, onClickCategory }) => {
  const category = ['Все', 'Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];
  return (
    <div className="categories">
      <ul>
        {category.map((categoryName, id) => (
          <li key={id} onClick={() => onClickCategory(id)} className={value === id ? 'active' : ''}>
            {categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Categories;
