<template>
  <div>
    <h1>Firebase Database Query Demo (Where, OrderBy, Limit)</h1>
    
    <div class="query-selector">
      <h3>Select Query Type:</h3>
      <div class="query-buttons">
        <button 
          @click="changeQueryType('isbn_gt_1000')" 
          :class="{ active: queryType === 'isbn_gt_1000' }"
          class="query-btn">
          ISBN > 1000 (Asc, Limit 10)
        </button>
        <button 
          @click="changeQueryType('isbn_lt_500')" 
          :class="{ active: queryType === 'isbn_lt_500' }"
          class="query-btn">
          ISBN < 500 (Desc, Limit 5)
        </button>
        <button 
          @click="changeQueryType('name_starts_with_a')" 
          :class="{ active: queryType === 'name_starts_with_a' }"
          class="query-btn">
          Name starts with 'A' (Asc, Limit 8)
        </button>
        <button 
          @click="changeQueryType('all_books')" 
          :class="{ active: queryType === 'all_books' }"
          class="query-btn">
          All Books (By ISBN Asc, Limit 15)
        </button>
      </div>
    </div>
    
    <ul>
      <li v-for="book in books" :key="book.id" class="book-item">
        <div v-if="editingBookId !== book.id">
          {{ book.name }} - ISBN: {{ book.isbn }}
          <div class="book-actions">
            <button @click="startEdit(book)" class="edit-btn">Edit</button>
            <button @click="deleteBook(book.id)" class="delete-btn">Delete</button>
          </div>
        </div>
        <div v-else class="edit-form">
          <input v-model="editForm.name" placeholder="Book Name" />
          <input v-model="editForm.isbn" type="number" placeholder="ISBN" />
          <div class="edit-actions">
            <button @click="saveEdit(book.id)" class="save-btn">Save</button>
            <button @click="cancelEdit" class="cancel-btn">Cancel</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import db from '../firebase/init.js';
import { collection, query, where, orderBy, limit, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default {
  name: 'BookList',
  setup() {
    const books = ref([]);
    const editingBookId = ref(null);
    const editForm = ref({ name: '', isbn: '' });
    const queryType = ref('isbn_gt_1000');

    const fetchBooks = async () => {
      try {
        let q;
        
        switch (queryType.value) {
          case 'isbn_gt_1000':
            q = query(
              collection(db, 'books'), 
              where('isbn', '>', 1000),
              orderBy('isbn', 'asc'),
              limit(10)
            );
            break;
          case 'isbn_lt_500':
            q = query(
              collection(db, 'books'), 
              where('isbn', '<', 500),
              orderBy('isbn', 'desc'),
              limit(5)
            );
            break;
          case 'name_starts_with_a':
            q = query(
              collection(db, 'books'), 
              where('name', '>=', 'A'),
              where('name', '<', 'B'),
              orderBy('name', 'asc'),
              limit(8)
            );
            break;
          case 'all_books':
            q = query(
              collection(db, 'books'), 
              orderBy('isbn', 'asc'),
              limit(15)
            );
            break;
          default:
            q = query(collection(db, 'books'), limit(10));
        }
        
        const querySnapshot = await getDocs(q);
        const booksArray = [];
        querySnapshot.forEach((doc) => {
          booksArray.push({ id: doc.id, ...doc.data() });
        });
        books.value = booksArray;
      } catch (error) {
        console.error('Error fetching books: ', error);
      }
    };

    const startEdit = (book) => {
      editingBookId.value = book.id;
      editForm.value = {
        name: book.name,
        isbn: book.isbn
      };
    };

    const saveEdit = async (bookId) => {
      try {
        const isbnNumber = Number(editForm.value.isbn);
        if (isNaN(isbnNumber)) {
          alert('ISBN must be a valid number');
          return;
        }
        
        await updateDoc(doc(db, 'books', bookId), {
          name: editForm.value.name,
          isbn: isbnNumber
        });
        
        await fetchBooks();
        editingBookId.value = null;
        editForm.value = { name: '', isbn: '' };
        alert('Book updated successfully!');
      } catch (error) {
        console.error('Error updating book: ', error);
        alert('Update failed: ' + error.message);
      }
    };

    const cancelEdit = () => {
      editingBookId.value = null;
      editForm.value = { name: '', isbn: '' };
    };

    const changeQueryType = (newType) => {
      queryType.value = newType;
      fetchBooks();
    };

    const deleteBook = async (bookId) => {
      if (confirm('Are you sure you want to delete this book?')) {
        try {
          await deleteDoc(doc(db, 'books', bookId));
          await fetchBooks();
          alert('Book deleted successfully!');
        } catch (error) {
          console.error('Error deleting book: ', error);
          alert('Delete failed: ' + error.message);
        }
      }
    };

    onMounted(() => {
      fetchBooks();
    });

    return { 
      books, 
      editingBookId, 
      editForm, 
      queryType,
      startEdit, 
      saveEdit, 
      cancelEdit, 
      deleteBook,
      changeQueryType
    };
  }
};
</script>

<style scoped>
h1 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.query-selector {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6;
}

.query-selector h3 {
  margin-bottom: 15px;
  color: #495057;
}

.query-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.query-btn {
  padding: 8px 16px;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.query-btn:hover {
  background: #007bff;
  color: white;
}

.query-btn.active {
  background: #007bff;
  color: white;
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding: 0;
}

.book-item {
  background: #f8f9fa;
  margin: 10px 0;
  padding: 15px;
  border-radius: 5px;
  border-left: 4px solid #007bff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn, .save-btn, .cancel-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn, .save-btn {
  background-color: #28a745;
  color: white;
}

.edit-btn:hover, .save-btn:hover {
  background-color: #218838;
}

.delete-btn, .cancel-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover, .cancel-btn:hover {
  background-color: #c82333;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.edit-form input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 14px;
}

.edit-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
