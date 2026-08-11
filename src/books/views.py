from django.shortcuts import get_object_or_404, render

from .models import Book


def home(request):
    books = Book.objects.filter(is_published=True)

    return render(request, "books/home.html", {
        "books": books,
    })


def book_list(request):
    books = Book.objects.filter(is_published=True)

    return render(request, "books/books.html", {
        "books": books,
    })


def book_detail(request, id):
    book = get_object_or_404(Book, id=id)

    book.views += 1
    book.save(update_fields=["views"])

    return render(request, "books/detail.html", {
        "book": book,
    })
