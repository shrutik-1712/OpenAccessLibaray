import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Change this to remove '/api' from the end
const API_BASE_URL = 'http://localhost:3001';
const API_URL = `${API_BASE_URL}/api`;

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
}

interface BookFormData {
  title: string;
  author: string;
  description: string;
  cover?: File;
}


const BooksAdmin = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    // Clean up preview URL when component unmounts
    return () => {
      if (previewUrl && !previewUrl.includes(API_URL)) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        const file = e.target.files[0];
        setSelectedFile(file);
        
        // Create preview URL for local file
        if (previewUrl && !previewUrl.includes(API_BASE_URL)) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(file));
      }
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', description: '' });
    setEditingBook(null);
    setError(null);
    setSelectedFile(null);
    if (previewUrl && !previewUrl.includes(API_URL)) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
    });
    // Update preview URL to use correct base URL
    setPreviewUrl(book.cover ? `${API_BASE_URL}${book.cover}` : null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('description', formData.description);
      
      if (selectedFile) {
        formDataToSend.append('cover', selectedFile);
      }

      const url = editingBook
        ? `${API_URL}/books/${editingBook._id}`
        : `${API_URL}/books`;
      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save book');
      }

      await fetchBooks();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete book');

      await fetchBooks();
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  // New component for book cover image with error handling
  const BookCover = ({ book }: { book: Book }) => {
    const [imageError, setImageError] = useState(false);
    
    // Construct the correct image URL by removing '/api' from the path
    const imageUrl = book.cover ? `${API_BASE_URL}${book.cover}` : null;

    if (imageError || !imageUrl) {
      return (
        <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4">
          <BookOpen className="w-16 h-16 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center">{book.title}</p>
        </div>
      );
    }

    return (
        <img
        src={imageUrl}
        alt={`Cover of ${book.title}`}
        className="object-cover rounded-lg w-full h-full"
        onError={() => setImageError(true)}
      />
    );
  };
  

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Library Books</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Book
        </Button>
      </div>

      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card key={book._id} className="flex flex-col">
            <CardHeader>
              <div className="aspect-[3/4] relative mb-4">
                <BookCover book={book} />
              </div>
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>by {book.author}</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-600">{book.description}</p>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(book)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(book._id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingBook ? "Edit Book" : "Add New Book"}
            </DialogTitle>
            <DialogDescription>
              Fill in the book details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <Input
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cover Image
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {previewUrl && (
                  <div className="mt-2 aspect-[3/4] relative w-32">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Book"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksAdmin;