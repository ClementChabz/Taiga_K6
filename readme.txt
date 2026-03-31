# Crée un package.json par défaut
npm init -y 

# Installe les types k6 (ce ne sont pas des bibliothèques, juste de la doc pour VS Code)
npm install --save-dev @types/k6

npm i -g k6

# Installer l'application de test sur docker : orangehrm + mariadb. InfluxDb1.8 + Grafana
cd k6-app
docker compose up -d
# Configurer l'application OrangeHRM
http://localhost:8200/installer/index.php/welcome


# Mode en enregistrement
k6 recorder

# Convertisseur har
npm install -g har-to-k6
har-to-k6 Tools/orangehrm.har -o scripts/employee-har.js

# run test
k6 run scripts/test.js

# Report
SET K6_WEB_DASHBOARD=true
k6 run -–duration 5m scripts/test.js
open http://localhost:5665/ui/?endpoint=/





