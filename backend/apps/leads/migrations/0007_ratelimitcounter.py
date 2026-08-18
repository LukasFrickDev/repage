from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0006_alter_emaildelivery_next_attempt_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='RateLimitCounter',
            fields=[
                ('key', models.CharField(max_length=128, primary_key=True, serialize=False)),
                ('count', models.PositiveIntegerField()),
                ('expires_at', models.DateTimeField()),
            ],
            options={
                'indexes': [
                    models.Index(fields=['expires_at'], name='rate_counter_expiry_idx'),
                ],
            },
        ),
    ]
