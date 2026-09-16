
import django_filters
from datetime import datetime, time, timedelta
from django.utils import timezone
from .models import Ticket


class TicketFilter(django_filters.FilterSet):
    created_after = django_filters.DateFilter(method='filter_created_after')
    created_before = django_filters.DateFilter(method='filter_created_before')

    def filter_created_after(self, queryset, name, value):
        start_of_day = timezone.make_aware(
            datetime.combine(value, time.min),
            timezone.get_current_timezone(),
        )
        return queryset.filter(created_at__gte=start_of_day)

    def filter_created_before(self, queryset, name, value):
        start_of_next_day = timezone.make_aware(
            datetime.combine(value + timedelta(days=1), time.min),
            timezone.get_current_timezone(),
        )
        return queryset.filter(created_at__lt=start_of_next_day)

    class Meta:
        model = Ticket
        fields = ['estado', 'prioridad', 'categoria']