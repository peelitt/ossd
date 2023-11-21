const mqtt = require('mqtt');

// Mosquitto MQTT 브로커 주소 및 포트
const brokerUrl = 'mqtt://localhost';  // Mosquitto 브로커 주소
const brokerPort = 1883;                // Mosquitto 브로커 포트

// Mosquitto 브로커에서 전송하는 토픽
const topic = 'test';

// MQTT 클라이언트 생성
const client = mqtt.connect(`${brokerUrl}:${brokerPort}`);

// 연결이 성공하면 데이터를 주기적으로 전송
client.on('connect', () => {
  setInterval(() => {
    const data = {
      temperature: Math.random() * 30, // 예시 데이터 (온도)
      humidity: Math.random() * 80,    // 예시 데이터 (습도)
    };

    // 데이터를 JSON 문자열로 변환하여 MQTT 토픽에 전송
    client.publish(topic, JSON.stringify(data));

    console.log('Data published:', data);
  }, 5000); // 5초마다 데이터 전송
});
