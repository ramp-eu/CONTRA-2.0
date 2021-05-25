# Docker-compose
> Konteneryzacja projektu DIH

Aktualnie, zgodnie z potrzebami został stworzony kontener API wraz z docker-compose, aby była możliwość rozbudowy stacka w przyszłości.

## Instrukcja obsługi
1. **Przygotowanie do włączenia**<br />
  - Skopiować zawartość api z wybranego brancha do folderu api/src
2. **Bazowe komendy**<br />
  - Włączenie stacka `docker-compose up -d`<br />
  - Wyłączenie stacka `docker-compose down`<br />
  - Wyświetlenie logów stacka, wraz z ich śledzeniem `docker-compose logs -f`<br />
  - Przebudowanie stacka `docker-compose up -d --build --no-cache --force-recreate`
