import React, { useState, useEffect } from 'react';
import { Tag } from '../types'; // Assuming Tag type is available in shared types
import { api } from '../services/api';

interface TagMultiSelectProps {
  selectedTags: number[];
  onChange: (selected: number[]) => void;
}

const TagMultiSelect: React.FC<TagMultiSelectProps> = ({ selectedTags, onChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api.getTags()
      .then((data: Tag[]) => {
        setTags(data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags.');
        setTags([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleCheckboxChange = (tagId: number) => {
    const isSelected = selectedTags.includes(tagId);
    if (isSelected) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  if (isLoading) {
    return <div>Loading tags...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (tags.length === 0) {
    return <div>No tags available.</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {tags.map(tag => (
          <div key={tag.id} className="flex items-center">
            <input
              id={`tag-${tag.id}`}
              name="tags"
              type="checkbox"
              checked={selectedTags.includes(tag.id)}
              onChange={() => handleCheckboxChange(tag.id)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`tag-${tag.id}`}
              className="ml-2 block text-sm text-gray-900"
            >
              {tag.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagMultiSelect;
