import React, { useEffect, useState } from 'react';

interface Item {
  id: number;
  code: string;
  name: string;
  description: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  status: string | null;
  components: any[];
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://20.231.202.18:8000/api/form');
      if (!response.ok) {
        throw new Error('Failed to fetch data from the API');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const response = await fetch(`http://20.231.202.18:8000/api/form/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the item');
      }
      fetchData(); // Fetch updated data after deletion
    } catch (error) {
      console.error(error);
    }
  };

  const updateItem = async (id: number) => {
    const itemToUpdate = items.find(item => item.id === id);
    if (!itemToUpdate) {
      throw new Error('Item not found');
    }

    setFormData({ code: itemToUpdate.code, name: itemToUpdate.name, description: itemToUpdate.description });
  };


  const createItem = async () => {
    try {
      const newItem = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
      };
  
      const existingItem = items.find(item => item.code === newItem.code);
      if (existingItem) {
        const response = await fetch(`http://20.231.202.18:8000/api/form/${existingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update the item');
        }
      } else {
        const response = await fetch('http://20.231.202.18:8000/api/form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create the item');
        }
      }
  
      setFormData({ code: '', name: '', description: '' }); // Clear form data
      fetchData(); // Fetch updated data after creation or update
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <h2>Create</h2>
      <form>
        <input
          type="text"
          name="code"
          placeholder="Code"
          value={formData.code}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <button type="button" onClick={createItem}>
          Create
        </button>
      </form>

      {items.map(item => (
        <p key={item.id}>
          <span>{item.name}</span>
          <span>{item.description}</span>
          <button onClick={() => deleteItem(item.id)}>Delete</button>
          <button onClick={() => updateItem(item.id)}>Update</button>
        </p>
      ))}
    </div>
  );
};

export default App;

