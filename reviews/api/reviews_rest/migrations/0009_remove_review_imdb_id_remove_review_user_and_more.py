# Generated by Django 4.0.3 on 2022-08-28 00:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reviews_rest', '0008_remove_movie_poster'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='review',
            name='imdb_id',
        ),
        migrations.RemoveField(
            model_name='review',
            name='user',
        ),
        migrations.AddField(
            model_name='review',
            name='movie',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='Review', to='reviews_rest.movie'),
            preserve_default=False,
        ),
    ]