# Generated by Django 4.2.9 on 2024-04-14 02:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revenue', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='photo_url_done',
            field=models.TextField(default=''),
        ),
    ]