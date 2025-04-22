import requests
import json
import base64
import threading
import time
import os
from typing import Dict, Any
from dotenv import load_dotenv
from mqtt_client import MQTTClient
from baicell_api_list import API_PATHS

load_dotenv()

BASE_URL = os.getenv("API_BASE_URL")
POLL_INTERVAL = int(os.getenv("POLL_INTERVAL"))


def build_endpoints(base_url: str, paths: Dict[str, Dict[str, str]]) -> Dict[str, Dict[str, str]]:
    """Combine base URL with paths to create full endpoint info including methods"""
    return {
        key: {
            "method": value["method"],
            "url": base_url.rstrip('/') + value["path"],
            "payload" : value["payload"],
            "WirelessDeviceId" : value["WirelessDeviceId"],
            "deviceType" : value["deviceType"]
        }
        for key, value in paths.items()
    }

def get_api_token() -> str:
    """Authenticate and return the access token"""
    login_url = BASE_URL.rstrip("/") + "/northboundApi/v1/access/token"
    credentials = {
        "username": os.getenv("BAICELL_API_USERNAME"),
        "password": os.getenv("BAICELL_API_PASSWORD")
    }

    try:
        response = requests.post(login_url, json=credentials, timeout=10)
        response.raise_for_status()

        try:
            data = response.json()
        except json.JSONDecodeError:
            print("Login response is not valid JSON:")
            print(response.text)
            return ""

        print("Login response JSON:", data)

        token = data.get("data", {}).get("token")
        if not token:
            print("Token not found in login response.")
            return ""

        return token

    except requests.exceptions.RequestException as e:
        print(f"Error getting API token: {str(e)}")
        return ""


def call_api_endpoint(url: str, method: str, token: str, payload: str, WirelessDeviceId: str, deviceType: str) -> Dict[str, Any]:
    """Call an API endpoint with method and auth token"""
    headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    }

    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method.upper() == "POST":
            # print(f"post data payload ------{payload} \n url {url}")
            payload_data = json.dumps(payload)
            response = requests.post(url, headers=headers, data=payload_data, timeout=10)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        response.raise_for_status()
        response_data = response.json()
        data = response_data.get("data", {})
        json_str = json.dumps(data)
        json_bytes = json_str.encode('utf-8')

        final_data = {
            "MessageId": "",
            "WirelessDeviceId": WirelessDeviceId,
            "deviceType": deviceType,
            "PayloadData": base64.b64encode(json_bytes).decode('utf-8'),
            "WirelessMetadata": {
                    "test": {
                    "test2": 2,
                    "test3": 85
                    }
                }
        }

        return final_data
    except requests.exceptions.RequestException as e:
        print(f"Error calling API endpoint {url}: {str(e)}")
        return {"error": "No data found for this API", "url": url}
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from {url}: {str(e)}")
        return {"error": "Invalid JSON response", "url": url}

def call_all_endpoints_send_to_mqtt(endpoints: Dict[str, Dict[str, str]], token: str, mqtt_client: MQTTClient):
    """Call all API endpoints and combine their responses"""


    for key, info in endpoints.items():
        url = info["url"]
        method = info["method"]
        payload = info["payload"]
        WirelessDeviceId = info["WirelessDeviceId"]
        deviceType = info["deviceType"]
        response_data = call_api_endpoint(url, method, token, payload, WirelessDeviceId, deviceType)
        print(f"final data before send----->>>{response_data}")
        mqtt_client.publish_json(response_data)


    # return combined_response


def periodic_api_call(interval: int, endpoints: Dict[str, Dict[str, str]], mqtt_client: MQTTClient):
    """Periodically call all API endpoints with token and send to MQTT"""
    while True:
        print(f"\n{time.strftime('%Y-%m-%d %H:%M:%S')} - Fetching API token...")
        token = get_api_token()
        if not token:
            print("Skipping API calls due to missing token.")
            time.sleep(interval)
            continue
        print(f"token------>>{token}")

        print("Calling API endpoints...")
        call_all_endpoints_send_to_mqtt(endpoints, token, mqtt_client)
        
        # print("Combined API Responses:")
        # print(json.dumps(combined_json, indent=2))

        # mqtt_client.publish_json(combined_json)
        time.sleep(interval)


if __name__ == "__main__":
    try:
        # Build full endpoints from base URL and paths
        api_endpoints = build_endpoints(BASE_URL, API_PATHS)
        
        print(f"API Base URL: {BASE_URL}")
        # print("API Endpoints:")
        # for name, endpoint in api_endpoints.items():
        #     print(f" - {name}: {endpoint}")
        
        # Initialize MQTT client (singleton)
        mqtt_client = MQTTClient()
        
        # Start the periodic API calls in a daemon thread
        api_thread = threading.Thread(
            target=periodic_api_call,
            args=(POLL_INTERVAL, api_endpoints, mqtt_client),
            daemon=True
        )
        api_thread.start()
        
        print(f"\nAPI polling started (interval: {POLL_INTERVAL} seconds).")
        
        # Keep the main thread alive
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nStopping API polling...")
