import os
import json
import csv
import math

def remove_first_path(origin: str):
    arr = origin.split("/")
    return "/".join(arr[1:len(arr)])

# file path in list_files should be relative to this script
def write_json(list_files: list, out_dir: str):
    cmd = "cat {} | vegeta report -type json > {}.json"
    for file in list_files:
        new_dir = remove_first_path(file['dir'])
        fdir = f"{out_dir}/{new_dir}"
        os.system(f"mkdir -p {fdir}")

        new_fpath = remove_first_path(file['path'])
        origin = file['path']
        final_cmd = cmd.format(origin, f"{out_dir}/{new_fpath}")
        os.system(final_cmd)

# get_list_files from root_dir
# root_dir should be relative to this script
def get_list_files(root_dir: str):
    test_dirs = os.listdir(root_dir)
    list_files = []
    for test_dir in test_dirs:
        fpath = f"{root_dir}/{test_dir}"
        # print(fpath)
        for r, d, f in os.walk(fpath):
            # print(f)
            for file in f:
                fobj = {
                    "path": f"{fpath}/{file}",
                    "dir": fpath
                }
                list_files.append(fobj)

    return list_files

def preprocess(root_dir: str):
    list_files = get_list_files(root_dir)
    # print(list_files)
    out_dir = f"json"
    write_json(list_files, out_dir)

def get_list_test(root_dir: str) -> list:
    list_test = []
    list_files = get_list_files(root_dir)
    for file in list_files:
        with open(file['path']) as j:
            list_test.append(json.load(j))

    return list_test

def calculate_total_mean_latencies(root_dir: str) -> object:
    list_test = []
    list_files = get_list_files(root_dir)
    for file in list_files:
        with open(file['path']) as j:
            fobj = json.load(j)
            fobj['group_dir'] = file['dir']
            list_test.append(fobj)
    
    total_mean_latencies_obj = {}
    for test in list_test:
        total_mean_latencies_obj[test['group_dir']] = 0 
    
    for test in list_test:
        total_mean_latencies_obj[test['group_dir']] += test["latencies"]["mean"]

    for key in total_mean_latencies_obj:
        total_mean_latencies_obj[key] = total_mean_latencies_obj[key]/5

    return total_mean_latencies_obj

def calculate_avg_success_rate(root_dir: str) -> object:
    list_test = []
    list_files = get_list_files(root_dir)
    for file in list_files:
        with open(file['path']) as j:
            fobj = json.load(j)
            fobj['group_dir'] = file['dir']
            list_test.append(fobj)
    
    total_avg_success_rate = {}
    for test in list_test:
        total_avg_success_rate[test['group_dir']] = {}
    
    all_status = {}
    for test in list_test:
        for key in test["status_codes"]:
            # total_avg_success_rate[test['group_dir']][key] = 0
            all_status[key] = key

    for test in list_test:
        for status in all_status:
            total_avg_success_rate[test['group_dir']][status] = 0

    for test in list_test:
        for status in test["status_codes"]:
            total_avg_success_rate[test['group_dir']][status] += test["status_codes"][status]

    return total_avg_success_rate

def total_mean_latencies_obj_in_second(root_dir: str):
    total_lat_obj = calculate_total_mean_latencies(root_dir)
    for key in total_lat_obj:
        sec = total_lat_obj[key] / ((10**6) * 1000)
        total_lat_obj[key] = float("{0:.2f}".format(sec))

    return total_lat_obj

def write_result(path: str, data: object):
    with open(path, "w+") as file:
        file.write(json.dumps(data, indent=2))
