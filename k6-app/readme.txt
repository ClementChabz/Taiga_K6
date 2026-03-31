Deploiement Docker Desktop Windows 11
Pb de connexion au socket telegraf
Important : Active l'API TCP non‑TLS dans Docker Desktop → Settings > General > "Expose daemon on tcp://localhost:2375 without TLS" (redémarre Docker après). 
C'est sûr pour local et évite les soucis de socket

1) Construire et lancer l'application + Redis
docker compose up -d --build

2) Verifier les logs de telegraf
docker compose logs -f telegraf

3) Arreter les conteneurs
docker compose down

4) Arreter et supprimer aussi le volume Redis (donnees)
docker compose down -v

docker compose up -d --force-recreate telegraf
docker compose logs -f telegraf

sudo usermod -aG docker telegraf

docker exec -it influxdb influx
## influxdb
-- 1. See if your database exists
SHOW DATABASES

-- 2. Select your database
USE orange_metrics

-- 3. List the measurements (tables) sent by k6
SHOW MEASUREMENTS

-- 4. Check the last 5 entries to see if data is flowing
SELECT * FROM http_req_duration LIMIT 5


