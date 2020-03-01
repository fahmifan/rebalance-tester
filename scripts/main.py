import processing
import os

os.system("mkdir -p result")
cases = ["load-balancer", "web-service"]
for case in cases:
    processing.preprocess(root_dir=f"raw/{case}")
    root_dir = f"json/{case}"
    latencies = processing.total_mean_latencies_obj_in_second(root_dir)
    processing.write_result(f"result/latencies_{case}_.json", latencies)

    success_rate = processing.calculate_avg_success_rate("json/load-balancer")
    processing.write_result(f"result/success_rate_{case}_.json", success_rate)
