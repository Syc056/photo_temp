# Generated by Django 4.2.9 on 2024-03-30 03:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('frame', '0004_frame_position'),
        ('layout', '0009_alter_layout_frame'),
    ]

    operations = [
        migrations.AlterField(
            model_name='layout',
            name='frame',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='frame.frame'),
        ),
    ]