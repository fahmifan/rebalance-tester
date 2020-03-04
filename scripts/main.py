import processing
import os
import json

root=os.getenv("root_folder")
os.system(f"mkdir -p result")
cases = ["web-service", "load-balancer"]
for case in cases:
    processing.preprocess(root_dir=f"{root}/{case}")
    root_dir = f"json/{case}"
    
    latencies = processing.total_mean_latencies_obj_in_second(root_dir)
    processing.write_result(f"result/latencies_{case}_.json", latencies)

    success_rate = processing.calculate_avg_success_rate(root_dir)
    processing.write_result(f"result/success_rate_{case}_.json", success_rate)
