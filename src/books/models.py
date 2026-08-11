from django.db import models


class Book(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    author = models.CharField(max_length=50, blank=True)

    ispaid = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    is_audiobook = models.BooleanField(default=False)

    price = models.PositiveIntegerField(default=0)

    image = models.ImageField(upload_to="book_images/", blank=True)
    audio = models.FileField(upload_to="book_audio/", blank=True, null=True)

    views = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name.title()

    def get_price(self):
        if self.price == 0:
            return "Free"
        return self.price
