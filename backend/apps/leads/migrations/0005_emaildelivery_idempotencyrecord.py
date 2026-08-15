import uuid

import django.db.models.deletion
from django.db import migrations, models
from django.utils import timezone


class Migration(migrations.Migration):
    dependencies = [
        ('leads', '0004_lead_acquisition_source'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailDelivery',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('kind', models.CharField(choices=[('internal_notification', 'Notificação interna'), ('visitor_confirmation', 'Confirmação ao visitante')], max_length=32)),
                ('status', models.CharField(choices=[('pending', 'Pendente'), ('sent', 'Enviado'), ('failed', 'Falhou')], default='pending', max_length=16)),
                ('attempts', models.PositiveIntegerField(default=0)),
                ('next_attempt_at', models.DateTimeField(default=timezone.now)),
                ('last_attempt_at', models.DateTimeField(blank=True, null=True)),
                ('last_error_code', models.CharField(blank=True, default='', max_length=64)),
                ('sent_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('lead', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='email_deliveries', to='leads.lead')),
            ],
            options={
                'indexes': [models.Index(fields=['status', 'next_attempt_at'], name='email_delivery_due_idx')],
                'constraints': [models.UniqueConstraint(fields=('lead', 'kind'), name='unique_lead_email_delivery_kind')],
            },
        ),
        migrations.CreateModel(
            name='IdempotencyRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.UUIDField(unique=True)),
                ('fingerprint', models.CharField(max_length=64)),
                ('response_status', models.PositiveSmallIntegerField()),
                ('response_payload', models.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField()),
                ('lead', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='idempotency_records', to='leads.lead')),
            ],
            options={
                'indexes': [
                    models.Index(fields=['expires_at'], name='idempotency_expiry_idx'),
                    models.Index(fields=['fingerprint', 'created_at'], name='idempotency_fingerprint_idx'),
                ],
            },
        ),
    ]
