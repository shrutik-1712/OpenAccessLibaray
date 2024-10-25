import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Users, Calendar, Gift, Phone, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import HeroCarousel from './HeroCarousel';
import Testimonials from './Testimonials';

interface BookType {
  _id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
}

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Icon className="mr-2" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
);

const BookCard = ({ book }: { book: BookType }) => (
  <Card className="w-full h-96 flex flex-col">
    <div className="h-48 relative">
      <img
        src={book.cover}
        alt={book.title}
        className="w-full h-full object-cover rounded-t-lg"
      />
    </div>
    <CardHeader>
      <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
      <CardDescription className="line-clamp-1">by {book.author}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
    </CardContent>
  </Card>
);

const BooksCarousel = ({ books }: { books: BookType[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 3 >= books.length) ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 3 < 0) ? Math.max(0, books.length - 3) : prevIndex - 3
    );
  };

  const visibleBooks = books.slice(currentIndex, currentIndex + 3);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          onClick={nextSlide}
          disabled={currentIndex + 3 >= books.length}
        >
          Next
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleBooks.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

const NewArrivalsSection = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load books: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (books.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No books available at the moment.
        </AlertDescription>
      </Alert>
    );
  }

  return <BooksCarousel books={books} />;
};

const Home = () => (
  <div>
    <HeroCarousel />
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-4">New Arrivals</h3>
        <NewArrivalsSection />
      </section>
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-4">Our Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={Book}
            title="Extensive Collection"
            description="Access thousands of books, journals, and research papers."
          />
          <FeatureCard
            icon={Users}
            title="Community Events"
            description="Join book clubs, workshops, and literary discussions."
          />
          <FeatureCard
            icon={Calendar}
            title="Easy Reservations"
            description="Reserve books online and pick them up at your convenience."
          />
          <FeatureCard
            icon={Gift}
            title="Special Programs"
            description="Enjoy reading programs for all ages and interests."
          />
        </div>
      </section>
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-4">What Our Community Says</h3>
        <Testimonials />
      </section>
      <section>
        <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Phone className="mr-2" />
              <span>+91 - 704572536</span>
            </div>
            <Button asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  </div>
);

export default Home;