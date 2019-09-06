import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { State } from "src/app/shared/state";
import {
  BookModel,
  calculateBooksGrossEarnings
} from "src/app/shared/models/book.model";
import { BooksService } from "src/app/shared/services/book.service";
import { BooksPageActions } from "../../actions";

@Component({
  selector: "app-books",
  templateUrl: "./books-page.component.html",
  styleUrls: ["./books-page.component.css"]
})
export class BooksPageComponent implements OnInit {
  books: BookModel[];
  currentBook: BookModel;
  total: number;

  constructor(
    private booksService: BooksService,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.getBooks();
    this.removeSelectedBook();

    this.store.dispatch(BooksPageActions.enter());
  }

  getBooks() {
    this.booksService.all().subscribe(books => {
      this.books = books;
      this.updateTotals(books);
    });
  }

  updateTotals(books: BookModel[]) {
    this.total = calculateBooksGrossEarnings(books);
  }

  onSelect(book: BookModel) {
    this.currentBook = book;

    this.store.dispatch(BooksPageActions.selectBook({ bookId: book.id }));
  }

  onCancel() {
    this.removeSelectedBook();
  }

  removeSelectedBook() {
    this.currentBook = null;

    this.store.dispatch(BooksPageActions.clearSelectedBook());
  }

  onSave(book: BookModel) {
    if (!book.id) {
      this.saveBook(book);
    } else {
      this.updateBook(book);
    }
  }

  saveBook(book: BookModel) {
    this.booksService.create(book).subscribe(() => {
      this.getBooks();
      this.removeSelectedBook();
    });

    this.store.dispatch(BooksPageActions.createBook({ book }));
  }

  updateBook(book: BookModel) {
    this.booksService.update(book.id, book).subscribe(() => {
      this.getBooks();
      this.removeSelectedBook();
    });

    this.store.dispatch(
      BooksPageActions.updateBook({ bookId: book.id, changes: book })
    );
  }

  onDelete(book: BookModel) {
    this.booksService.delete(book.id).subscribe(() => {
      this.getBooks();
      this.removeSelectedBook();
    });

    this.store.dispatch(BooksPageActions.deleteBook({ bookId: book.id }));
  }
}
