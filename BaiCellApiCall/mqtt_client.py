# mqtt_client.py
import json
from awscrt import io, mqtt
from awsiot import mqtt_connection_builder
from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

class MQTTClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MQTTClient, cls).__new__(cls)
            cls._instance._initialize_client()
        return cls._instance

    def _initialize_client(self):
        """Initialize the MQTT client with AWS IoT configuration"""
        try:
            # AWS IoT Core configuration
            endpoint = os.getenv("MQTT_BROKER_URL")
            cert_path = os.getenv("CERTIFICATE_PATH")
            key_path = os.getenv("PRIVATE_KEY_PATH")
            root_ca_path = os.getenv("ROOT_CA_PATH")
            client_id = os.getenv("CLIENT_ID")
            self.topic = os.getenv("MQTT_TOPIC")

            # Event loop group and host resolver
            event_loop_group = io.EventLoopGroup(1)
            host_resolver = io.DefaultHostResolver(event_loop_group)
            client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)

            # Create MQTT connection
            self.mqtt_connection = mqtt_connection_builder.mtls_from_path(
                endpoint=endpoint,
                cert_filepath=cert_path,
                pri_key_filepath=key_path,
                client_bootstrap=client_bootstrap,
                ca_filepath=root_ca_path,
                client_id=client_id,
                clean_session=False,
                # keep_alive_secs=30
            )

            # Connect to AWS IoT Core
            connect_future = self.mqtt_connection.connect()
            connect_future.result()  # Wait for connection
            print(f"Connected to AWS IoT Core at {endpoint}")

        except Exception as e:
            print(f"Failed to connect to AWS IoT Core: {str(e)}")
            raise

    # def publish_json(self, data: Dict[str, Any]):
    #     """Publish JSON data to the configured topic"""
    #     try:
    #         payload = json.dumps(data)
    #         publish_future = self.mqtt_connection.publish(
    #             topic=self.topic,
    #             payload=payload,
    #             qos=mqtt.QoS.AT_LEAST_ONCE
    #         )
    #         publish_future.result()  # Wait for publish to complete
    #         print(f"Data published to AWS IoT topic '{self.topic}'")
    #     except Exception as e:
    #         print(f"Error publishing to AWS IoT: {str(e)}")
    def publish_json(self, data: Dict[str, Any]):
        """Publish JSON data to the configured topic"""
        try:
            payload = json.dumps(data)
            publish_future, _ = self.mqtt_connection.publish(
                topic=self.topic,
                payload=payload,
                qos=mqtt.QoS.AT_LEAST_ONCE
            )
            publish_future.result()  # Wait for publish to complete
            print(f"Data published to AWS IoT topic '{self.topic}'")
        except Exception as e:
            print(f"Error publishing to AWS IoT: {str(e)}")


    def __del__(self):
        """Clean up when instance is destroyed"""
        if hasattr(self, 'mqtt_connection'):
            disconnect_future = self.mqtt_connection.disconnect()
            disconnect_future.result()
