# DIH - IoT_RS232_Agent

## Cel projektu DIH

Celem projektu jest zautomatyzowanie linii produkcyjnych i ułatwienie automatycznego pobierania danych z różnych maszyn, tj. robotów i maszyn produkcyjnych umieszczonych wzdłuż linii produkcyjnej, w celu skrócenia czasu produkcji i zmniejszenia kosztów. Proponowane rozwiązanie umożliwi realizację procesu produkcji "just-in-time": dostawa materiałów wejściowych i odbiór materiałów wyjściowych, tak aby nie było żadnych przestojów w procesie. Dzięki możliwościom oferowanym przez platformę FIWARE, ITTI planuje zintegrować różne urządzenia z systemem CONTRA, aby umożliwić automatyczne gromadzenie danych. Analizowanie informacji dotyczących zakończonych operacji, szacowanego czasu produkcji, kolejności produkcji itp. umożliwi określenie kolejności realizacji zleceń produkcyjnych i pozwoli na usprawnienie całego procesu produkcji. Dostęp do wszystkich danych dotyczących produkcji pozwoli na porównanie planowanych i rzeczywistych wielkości produkcji w dowolnym momencie, dzięki czemu harmonogramowanie będzie bardziej realistyczne, a w konsekwencji pozwoli na dotrzymanie terminów dostaw. Integracja kilku maszyn z systemem CONTRA i dostęp do rzeczywistych i dokładnych danych umożliwi identyfikację wąskich gardeł w procesie, pozwoli lepiej oszacować wykorzystanie zasobów i zoptymalizować harmonogramowanie przychodzących zleceń produkcyjnych.

## Aplikacja IoT_RS232_Agnet


## Technologie

* **Backend:** Node JS

## Struktura projektu


## Instalacja i konfiguracja 
### Instalacja wersji webowej (wersja webowa pozwala na sterowanie połączeniem między aplikacją node a konwerterem w trybie transparentnym)
`cd web`
`npm install`
### Uruchomienie projektu webowego
`npm start`

### Instalacja głównej aplikacji node + IOT Agent
`cd api`
`npm install`
### Uruchomienie projektu webowego
`npm start`

### Wymagania
Lista wymagań jakie należy spełnić aby zainstalować, uruchomić i rozwijać system:


* Docker v1.1.1+
* Nginx 1.3+ (szablon kontenera Docker, wersja xxx )
* Gradle
* Semantic-UI React 0.82
* min. 8GB RAM 

### Instalacja środowiska dev

Procedura instalacji lokalnego środowiska deweloperskiego systemu i budowania projektu:
`opisać osobna dla frontend, backend itp.`

```
przykłdowe komendy sh, skrypty itp. 
```

### Instalacja systemu (deployment)
Procedura instalacji systemu na `serwerze zdalnym, lokalnej maszynie itp`:

```
przykłdowe komendy, skrypty itp. 
```

### Weryfikacja poprawności instalacji (sanity tests)
W celu weryfikacji poprawności intalacji systemu należy:

```
lista komend, skryptów, curl'e itp. które nalezy wykonać wraz ze porządanym rezultatem
```

## Procedury administracyjne
Uruchomienie systemu: 
```
przykłdowe komendy, skrypty itp. 
```

Restart systemu: 
```
przykłdowe komendy, skrypty itp. 
```

Zatrzymanie systemu: 
```
przykłdowe komendy, skrypty itp. 
```

Tworzenie kopii zapasowych DB: 
```
przykłdowe komendy, skrypty itp. 
```

Przywrócenie kopii zapasowych DB: 
```
przykłdowe komendy, skrypty itp. 
```

Generowanie danych testowych w DB: 
```
przykłdowe komendy, skrypty itp. 
```

### Zasoby 
#### CONTEXT BROKER
adres 192.168.1.117  
u - devops  
h - dihproj  

## Wersja

Wersja systemu której dotyczy dokumentacja: `numer najnowszej wersji systemu którego dotyczy dokumentacja`

## Zespół

* **PGMI** - *KP*
* **TSRP** - *wsparcie architektoniczne*
* **MSZU** - *dev części IoT i integrcji IoT-ContexBroker(NGSI)*


## Licencja 

Ten projektu jest własnością ITTI sp. z o.o. (ul. Rubież 46 61-612 Poznań, Polska, sekretariat@itti.com.pl tel. 61/ 622 69 85, fax 61/ 622 69 73)
 `+link to pliku z licencją jeśli dotyczy`

## Linki

* wiki projektu https://wiki.itti.com.pl/wiki/contra/view/08%20Podprojekty/DIH%20/
