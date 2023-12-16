# Sample Boiler Plate for FAST API and Celery


## create virtual env
```
# window users
python -m venv venv

# activate enviroment
. venv/Scripts/activate

# install requirements
pip3 install requirements.txt

```

## runung the web app
```
uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload
```
## Visit Docker Runing app
```
# build app
docker-compose up --build

# for docker run app visit
http://0.0.0.0:8001/ 
```
