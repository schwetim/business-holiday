import React, { useState, useEffect } from 'react';
import { Category } from '../types'; // Assuming Category type is available in shared types
import { api } from '../services/api';

interface CategoryMultiSelectProps {
  selectedCategories: number[];
  onChange: (selected: number[]) => void;
}

const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({ selectedCategories, onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api.getCategories()
      .then((data: Category[]) => {
        setCategories(data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
        setCategories([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleCheckboxChange = (categoryId: number) => {
    const isSelected = selectedCategories.includes(categoryId);
    if (isSelected) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (categories.length === 0) {
    return <div>No categories available.</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Categories
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {categories.map(category => (
          <div key={category.id} className="flex items-center">
            <input
              id={`category-${category.id}`}
              name="categories"
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCheckboxChange(category.id)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`category-${category.id}`}
              className="ml-2 block text-sm text-gray-900"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMultiSelect;
