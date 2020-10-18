#!/bin/bash

# protocol=http
if [[ -z ${protocol+x} || "$protocol" == "" ]]
    then protocol=http
fi

# port=8000 # web-service
if [[ -z ${port+x} || "$port" == "" ]]
    then port=9000
fi

# host=10.113.113.148 # web service
if [[ -z ${host+x} || "$host" == "" ]]
    then host=http://127.0.0.1
fi

# root_folder=test-folder
if [[ -z ${root_folder+x} || "$root_folder" == "" ]]
    then root_folder=test-folder
fi

# maxcounter=5
if [[ -z ${maxcounter+x} || "$maxcounter" == "" ]]
    then maxcounter=5
fi

# pause=5s
if [[ -z ${pause+x} || "$pause" == "" ]]
    then pause=5s
fi

# timeout=60s
if [[ -z ${timeout+x} || "$timeout" == "" ]]
    then timeout=60s
fi

# duration=1s
if [[ -z ${duration+x} || "$duration" == "" ]]
    then duration=1s
fi

# step=100
if [[ -z ${step+x} || "$step" == "" ]]
    then step=100
fi

# minrate=100
if [[ -z ${minrate+x} || "$minrate" == "" ]]
    then minrate=100
fi

# maxrate=1000
if [[ -z ${maxrate+x} || "$maxrate" == "" ]]
    then maxrate=1000
fi

echo "==========================="
echo "target host $protocol://$host:$port"
echo "save test file to '$root_folder'"
echo "test repetition $maxcounter"
echo "pause between repetition $pause"
echo "max timeout $timeout"
echo "attack duration $duration"
echo "test rate from $minrate to $maxrate with increasing step of $step"
echo "==========================="
echo ""

for (( rate=$minrate; rate<$maxrate; rate=$rate+$step ))
do
    out_folder="${root_folder}/${host}_${rate}rps_${duration}"
    mkdir -p "$out_folder"

    for (( counter=0; counter<$maxcounter; counter++ ))
    do
        out=${out_folder}/${port}_${rate}rps_1s_${counter}.out
        proxy="GET $protocol://${host}:${port}/api/sorts"
        # vegeta command
        echo ${proxy} | vegeta attack \
            -insecure \
            -duration=${duration} \
            -rate=${rate}/s \
            -timeout=${timeout} \
            > ${out}
        echo ${out}
        sleep ${pause}
    done
done
