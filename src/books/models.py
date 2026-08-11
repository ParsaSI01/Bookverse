from django.db import models


class Book(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    ispaid = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    if ispaid:
        price = models.PositiveIntegerField()
    image = models.ImageField(upload_to='book_images/')



