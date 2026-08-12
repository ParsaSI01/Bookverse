from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

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
    book = get_object_or_404(
        Book,
        id=id,
        is_published=True,
    )

    book.views += 1
    book.save(update_fields=["views"])

    my_books = request.session.get("my_books", [])

    is_owned = book.id in my_books

    return render(request, "books/detail.html", {
        "book": book,
        "is_owned": is_owned,
    })


@login_required
def book_reader(request, id):
    book = get_object_or_404(
        Book,
        id=id,
        is_published=True,
    )

    my_books = request.session.get("my_books", [])

    if book.id not in my_books:
        return redirect("book_detail", id=book.id)

    return render(request, "books/reader.html", {
        "book": book,
    })


def cart(request):
    cart_data = request.session.get("cart", {})

    books = Book.objects.filter(
        id__in=cart_data.keys(),
        is_published=True,
    )

    items = []
    total = 0
    total_items = 0

    for book in books:
        quantity = int(
            cart_data.get(str(book.id), 0)
        )

        if quantity <= 0:
            continue

        subtotal = book.price * quantity

        items.append({
            "book": book,
            "quantity": quantity,
            "subtotal": subtotal,
        })

        total += subtotal
        total_items += quantity

    return render(request, "books/cart.html", {
        "items": items,
        "total": total,
        "total_items": total_items,
    })


@require_POST
def add_to_cart(request, id):
    book = get_object_or_404(
        Book,
        id=id,
        is_published=True,
    )

    my_books = request.session.get("my_books", [])

    # Don't allow someone to buy a book they already own.
    if book.id in my_books:
        return redirect("book_detail", id=book.id)

    cart_data = request.session.get("cart", {})

    book_id = str(book.id)

    cart_data[book_id] = (
        int(cart_data.get(book_id, 0)) + 1
    )

    request.session["cart"] = cart_data
    request.session.modified = True

    return redirect("cart")


@require_POST
def update_cart(request, id):
    book = get_object_or_404(
        Book,
        id=id,
        is_published=True,
    )

    cart_data = request.session.get("cart", {})

    book_id = str(book.id)

    try:
        quantity = int(
            request.POST.get("quantity", 1)
        )
    except (TypeError, ValueError):
        quantity = 1

    if quantity <= 0:
        cart_data.pop(book_id, None)
    else:
        cart_data[book_id] = quantity

    request.session["cart"] = cart_data
    request.session.modified = True

    return redirect("cart")


@require_POST
def remove_from_cart(request, id):
    cart_data = request.session.get("cart", {})

    cart_data.pop(str(id), None)

    request.session["cart"] = cart_data
    request.session.modified = True

    return redirect("cart")


@login_required
@require_POST
def checkout(request):
    cart_data = request.session.get("cart", {})

    if not cart_data:
        return redirect("cart")

    my_books = request.session.get("my_books", [])

    for book_id in cart_data.keys():

        book_id = int(book_id)

        if book_id not in my_books:
            my_books.append(book_id)

    request.session["my_books"] = my_books

    request.session["cart"] = {}

    request.session.modified = True

    return redirect("my_books")


@login_required
def my_books(request):
    book_ids = request.session.get(
        "my_books",
        [],
    )

    books = Book.objects.filter(
        id__in=book_ids,
        is_published=True,
    )

    return render(request, "books/my_books.html", {
        "books": books,
    })