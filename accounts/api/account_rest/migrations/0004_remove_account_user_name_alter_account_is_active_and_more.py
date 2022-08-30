# Generated by Django 4.0.3 on 2022-08-30 00:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account_rest', '0003_alter_account_password'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='user_name',
        ),
        migrations.AlterField(
            model_name='account',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='username',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
