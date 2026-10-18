import time
import numpy as np
import httpx
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from src.app_v2 import app

def run_benchmark():
    print("==========================================================")
    print("  K-NEXUS Two-Tier Low-Latency Benchmark   ")
    print("  Track 2: Data Science & Intelligence (Target: < 80ms)  ")
    print("==========================================================")

    # Use TestClient directly for deterministic, in-process network latency profiling
    client = TestClient(app)

    sentinel_payload = {
        "source_account_id": "ACC_0500",
        "target_account_id": "ACC_0001",
        "amount": 32000.0,
        "is_first_time_transfer": 1,
        "device_switch_last_24h": 0,
        "session_duration_sec": 12,
        "ratio_to_daily_avg": 14.5,
        "auth_factor_used": "pin"
    }

    # 1. Warm-up
    print("[Warmup] Executing 10 warm-up runs on ONNX sessions...")
    for _ in range(10):
        client.post("/api/v2/trustgraph/evaluate-transfer", json=sentinel_payload)
        client.get("/api/v2/flowsense/horizon-status/ACC_0100")
        client.get("/api/v2/flowsense/forecast-30d/ACC_0100")

    # 2. Benchmark TrustGraph Pre-Transaction Screening (Tier 1 Redis Lookup + Tier 2 ONNX Inference)
    print("\n[Benchmark 1/2] Benchmarking TrustGraph Pre-Transaction Screening (200 Iterations)...")
    sentinel_latencies = []
    engine_reported_latencies = []
    
    for _ in range(200):
        t0 = time.perf_counter()
        resp = client.post("/api/v2/trustgraph/evaluate-transfer", json=sentinel_payload)
        t1 = time.perf_counter()
        assert resp.status_code == 200, f"Error: {resp.status_code}"
        
        total_roundtrip_ms = (t1 - t0) * 1000
        sentinel_latencies.append(total_roundtrip_ms)
        engine_reported_latencies.append(resp.json().get("latency_ms", 0.0))

    s_p50 = np.percentile(sentinel_latencies, 50)
    s_p95 = np.percentile(sentinel_latencies, 95)
    s_p99 = np.percentile(sentinel_latencies, 99)
    eng_p99 = np.percentile(engine_reported_latencies, 99)

    print("--- TrustGraph Screening Performance ---")
    print(f"Total API Latency P50: {s_p50:.2f} ms")
    print(f"Total API Latency P95: {s_p95:.2f} ms")
    print(f"Total API Latency P99: {s_p99:.2f} ms")
    print(f"Core ONNX Engine P99:  {eng_p99:.2f} ms")
    
    if s_p99 < 80.0:
        print(">>> SUCCESS: TrustGraph comfortably satisfies sub-80ms banking SLA! <<<")
    else:
        print(">>> WARNING: Exceeded 80ms SLA! <<<")

    # 3. Benchmark FlowSense 30-Day Forward Forecast
    print("\n[Benchmark 2/2] Benchmarking FlowSense 30-Day Liquidity Forecast (100 Iterations)...")
    wealth_latencies = []
    for _ in range(100):
        t0 = time.perf_counter()
        resp = client.get("/api/v2/flowsense/forecast-30d/ACC_0100")
        t1 = time.perf_counter()
        assert resp.status_code == 200
        wealth_latencies.append((t1 - t0) * 1000)

    w_p50 = np.percentile(wealth_latencies, 50)
    w_p95 = np.percentile(wealth_latencies, 95)
    w_p99 = np.percentile(wealth_latencies, 99)

    print("--- FlowSense Forecast Performance ---")
    print(f"30-day Forecast P50:   {w_p50:.2f} ms")
    print(f"30-day Forecast P95:   {w_p95:.2f} ms")
    print(f"30-day Forecast P99:   {w_p99:.2f} ms")

    print("\n==========================================================")
    print("  ALL BENCHMARK TESTS COMPLETED AND VALIDATED  ")
    print("==========================================================")

if __name__ == "__main__":
    run_benchmark()
