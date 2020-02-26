#!/bin/bash
minrate=500
maxrate=8000
step=100
duration=1s
port=9000
host=10.113.113.84
timeout=60s
pause=5s
root_folder=lab-aio
for (( rate=$minrate; rate<$maxrate; rate=${rate+step} ))
do
    sleep ${pause}

    out_folder="${root_folder}/${host}_${rate}rps_${duration}"
    mkdir -p "$out_folder"

    for (( counter=5; counter>0; counter-- ))
    do
        sleep ${pause}
        out=${out_folder}/${port}_${rate}rps_1s_${counter}.out
        proxy="GET http://${host}:${port}/api/sorts"
        # vegeta command
        echo ${proxy} | vegeta attack -insecure -duration=${duration} -rate=${rate}/s  -timeout=${timeout} > ${out}
        echo ${out}
    done
done