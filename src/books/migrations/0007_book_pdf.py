from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("books", "0006_alter_book_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="book",
            name="pdf",
            field=models.FileField(
                blank=True,
                null=True,
                upload_to="book_pdfs/",
            ),
        ),
    ]