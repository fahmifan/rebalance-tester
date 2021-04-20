# Test Scripts

Running the test scripts

```
now=$(date +"%Y-%m-%dT%H%M%S") \
port=9000 \
host=127.0.0.1 \
root_folder=testing/$now/raw/load-balancer \
step=100 \
pause=10s \
maxcounter=1 \
minrate=100 \
maxrate=100 \
timeout=180s \
scripts/tester.sh;
```
