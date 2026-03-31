git clone https://github.com/taigaio/taiga-docker.git
cd taiga-docker
git checkout stable

linux
=======
./launch-taiga.sh
/taiga-manage.sh createsuperuser

Windows
===========
docker compose -f docker-compose.yml up -d 
docker compose -f docker-compose.yml -f docker-compose-inits.yml run --rm taiga-manage createsuperuser


supprimer les contrainers et les volumes
=============================================
docker compose -f docker-compose.yml down -v 