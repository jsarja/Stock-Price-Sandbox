# Generated by Django 3.0.2 on 2020-03-17 12:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_apiuser_test_field'),
    ]

    operations = [
        migrations.RenameField(
            model_name='apiuser',
            old_name='test_field',
            new_name='alpha_vantage_api_key',
        ),
    ]
