from django.urls import path

from . import views


urlpatterns = [

    path(
        "",
        views.home,
        name="home",
    ),

    path(
        "books/",
        views.book_list,
        name="book_list",
    ),

    path(
        "books/<int:id>/",
        views.book_detail,
        name="book_detail",
    ),

    path(
        "books/<int:id>/read/",
        views.book_reader,
        name="book_reader",
    ),

    path(
        "cart/",
        views.cart,
        name="cart",
    ),

    path(
        "cart/add/<int:id>/",
        views.add_to_cart,
        name="add_to_cart",
    ),

    path(
        "cart/update/<int:id>/",
        views.update_cart,
        name="update_cart",
    ),

    path(
        "cart/remove/<int:id>/",
        views.remove_from_cart,
        name="remove_from_cart",
    ),

    path(
        "cart/checkout/",
        views.checkout,
        name="checkout",
    ),

    path(
        "my-books/",
        views.my_books,
        name="my_books",
    ),
]