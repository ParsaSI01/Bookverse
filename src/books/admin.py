from django.contrib import admin

from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "author",
        "ispaid",
        "is_published",
        "is_audiobook",
        "price",
        "views",
    )

    list_filter = (
        "ispaid",
        "is_published",
        "is_audiobook",
    )

    search_fields = (
        "name",
        "author",
        "description",
    )

    fieldsets = (
        (
            "Book information",
            {
                "fields": (
                    "name",
                    "author",
                    "description",
                    "image",
                )
            },
        ),
        (
            "Publishing",
            {
                "fields": (
                    "is_published",
                    "ispaid",
                    "price",
                )
            },
        ),
        (
            "Book content",
            {
                "fields": (
                    "is_audiobook",
                    "pdf",
                    "audio",
                ),
                "description": (
                    "Upload a PDF for a normal book or an audio "
                    "file for an audiobook. The reader/player "
                    "will use the appropriate file automatically."
                ),
            },
        ),
        (
            "Statistics",
            {
                "fields": (
                    "views",
                ),
            },
        ),
    )

    readonly_fields = (
        "views",
    )