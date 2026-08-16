from django.db import migrations, models
from django.utils import timezone


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0005_emaildelivery_idempotencyrecord'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emaildelivery',
            name='next_attempt_at',
            field=models.DateTimeField(blank=True, default=timezone.now, null=True),
        ),
    ]
