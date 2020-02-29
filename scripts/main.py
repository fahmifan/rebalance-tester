import processing
import os

os.system("mkdir -p result")
cases = ["load-balancer", "web-service"]
for case in cases:
    processing.preprocess(root_dir=f"raw/{case}")
    root_dir = f"json/{case}"
    data = processing.total_mean_latencies_obj_in_second(root_dir)
    processing.write_result(f"result/{case}.json", data)
