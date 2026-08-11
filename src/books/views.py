from django.shortcuts import get_object_or_404, render
from .models import Book


def book_detail(request, id):
    book = get_object_or_404(Book, id=id)

    book.views += 1
    book.save(update_fields=["views"])

    return render(request, "books/detail.html", {
        "book": book,
    })
