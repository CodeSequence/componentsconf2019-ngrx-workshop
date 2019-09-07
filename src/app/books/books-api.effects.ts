import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import {
  mergeMap,
  map,
  catchError,
  exhaustMap,
  concatMap
} from "rxjs/operators";
import { EMPTY } from "rxjs";
import { BooksService } from "../shared/services/book.service";
import { BooksPageActions, BooksApiActions } from "./actions";

@Injectable()
export class BooksApiEffects {
  @Effect()
  loadBooks$ = this.actions$.pipe(
    ofType(BooksPageActions.enter),
    exhaustMap(() =>
      this.booksService.all().pipe(
        map(books => BooksApiActions.booksLoaded({ books })),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  createBook$ = this.actions$.pipe(
    ofType(BooksPageActions.createBook),
    mergeMap(action =>
      this.booksService.create(action.book).pipe(
        map(book => BooksApiActions.bookCreated({ book })),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  updateBook$ = this.actions$.pipe(
    ofType(BooksPageActions.updateBook),
    concatMap(action =>
      this.booksService.update(action.bookId, action.changes).pipe(
        map(book => BooksApiActions.bookUpdated({ book })),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  deleteBook$ = this.actions$.pipe(
    ofType(BooksPageActions.deleteBook),
    mergeMap(action =>
      this.booksService.delete(action.bookId).pipe(
        map(() => BooksApiActions.bookDeleted({ bookId: action.bookId })),
        catchError(() => EMPTY)
      )
    )
  );

  constructor(private booksService: BooksService, private actions$: Actions) {}
}
