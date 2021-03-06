# Generated by Django 2.1.3 on 2019-01-19 13:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_remove_clinic_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='clinic',
            name='address',
            field=models.CharField(default=0, max_length=50),
        ),
        migrations.AddField(
            model_name='clinic',
            name='contact',
            field=models.CharField(default=0, max_length=50),
        ),
        migrations.AddField(
            model_name='clinic',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
