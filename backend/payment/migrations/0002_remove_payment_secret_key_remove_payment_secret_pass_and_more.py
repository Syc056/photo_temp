# Generated by Django 5.0.3 on 2024-03-25 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='secret_key',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='secret_pass',
        ),
        migrations.AddField(
            model_name='payment',
            name='appID',
            field=models.TextField(default='2553'),
        ),
        migrations.AddField(
            model_name='payment',
            name='code',
            field=models.TextField(default='zalopay', unique=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='endpoint_prod',
            field=models.TextField(default='https://openapi.zalopay.vn/v2/create'),
        ),
        migrations.AddField(
            model_name='payment',
            name='endpoint_sandbox',
            field=models.TextField(default='https://sb-openapi.zalopay.vn/v2/create'),
        ),
        migrations.AddField(
            model_name='payment',
            name='key1',
            field=models.TextField(default='PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL'),
        ),
        migrations.AddField(
            model_name='payment',
            name='key2',
            field=models.TextField(default='kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz'),
        ),
        migrations.AddField(
            model_name='payment',
            name='password',
            field=models.TextField(default='123'),
        ),
        migrations.AddField(
            model_name='payment',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='username',
            field=models.TextField(default='account-demo'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='token',
            field=models.TextField(default='123'),
        ),
    ]
