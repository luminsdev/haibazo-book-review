from app.database import SessionLocal
from app.models import Author, Book, Review

AUTHORS = [
    "Jack Troute",
    "Inamori Kazuo",
    "Stephen King",
    "J. K. Rowling",
    "Dan Brown",
    "Haruki Murakami",
    "George R. R. Martin",
    "Agatha Christie",
    "Yuval Noah Harari",
    "Paulo Coelho",
    "Malcolm Gladwell",
    "James Clear",
    "Robert Kiyosaki",
]
BOOKS = [
    ("The 22 Immutable Laws of Marketing", "Jack Troute"),
    ("Positioning: The Battle for Your Mind", "Jack Troute"),
    ("Harry Potter and the Philosopher's Stone", "J. K. Rowling"),
    ("The Running Grave", "J. K. Rowling"),
    ("The Shining", "Stephen King"),
    ("It", "Stephen King"),
    ("The Da Vinci Code", "Dan Brown"),
    ("Angels & Demons", "Dan Brown"),
    ("Norwegian Wood", "Haruki Murakami"),
    ("Kafka on the Shore", "Haruki Murakami"),
    ("A Game of Thrones", "George R. R. Martin"),
    ("Murder on the Orient Express", "Agatha Christie"),
    ("Sapiens", "Yuval Noah Harari"),
    ("Homo Deus", "Yuval Noah Harari"),
    ("The Alchemist", "Paulo Coelho"),
    ("Outliers", "Malcolm Gladwell"),
    ("Atomic Habits", "James Clear"),
    ("Rich Dad Poor Dad", "Robert Kiyosaki"),
]
REVIEWS = [
    ("The 22 Immutable Laws of Marketing", "Good book!"),
    ("Positioning: The Battle for Your Mind", "Very good!"),
    ("Harry Potter and the Philosopher's Stone", "Nice book!"),
    ("The Running Grave", "I'm so excited!"),
    ("The Shining", "I recommend this book!"),
    ("Atomic Habits", "Life-changing read."),
    ("Sapiens", "Mind-blowing perspective on human history."),
    ("The Alchemist", "A beautiful parable about following dreams."),
    ("The Da Vinci Code", "Page-turner from start to finish."),
    ("Norwegian Wood", "Melancholic and beautiful."),
    ("A Game of Thrones", "Epic fantasy done right."),
    ("Outliers", "Changed how I think about success."),
]

def seed() -> None: 
    db = SessionLocal()
    try:
        if db.query(Author).first():
            print("Database already seeded - skipping.")
            return
        
        authors_by_name = {}
        for name in AUTHORS:
            author = Author(name=name)
            db.add(author)
            authors_by_name[name] = author 
        db.flush()
        print(f"Inserted {len(AUTHORS)} authors")

        books_by_title = {} 
        for title, author_name in BOOKS:
            book = Book(title=title, author_id=authors_by_name[author_name].id)
            db.add(book)
            books_by_title[title] = book
        db.flush()
        print(f"Inserted {len(BOOKS)} books")

        for book_title, content in REVIEWS: 
            review = Review(
                book_id=books_by_title[book_title].id,
                content=content
            )
            db.add(review)
        db.flush()
        print(f"Inserted {len(REVIEWS)} reviews")

        db.commit()
        print("Seed complete.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
