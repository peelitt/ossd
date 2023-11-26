const mqtt = require('mqtt');

// Mosquitto MQTT 브로커 주소 및 포트
//const brokerUrl = 'mqtt://localhost';  // Mosquitto 브로커 주소
//const brokerPort = 1883;                // Mosquitto 브로커 포트

// Mosquitto 브로커에서 전송하는 토픽
const topic = 'data';

// MQTT 클라이언트 생성
//const client = mqtt.connect(`${brokerUrl}:${brokerPort}`);
// MQTT 브로커에 연결
const client = mqtt.connect('ws://localhost:9001'); // 웹소켓 주소에 맞게 수정

// 연결이 성공하면 데이터를 주기적으로 전송
client.on('connect', () => {
  setInterval(() => {
    /*
    const data = {
      temperature: Math.random() * 30, // 예시 데이터 (온도)
      humidity: Math.random() * 80,    // 예시 데이터 (습도)
    };
    */
   const temperature= Math.random() * 30

    // 데이터를 JSON 문자열로 변환하여 MQTT 토픽에 전송
    const message = Buffer.from(String(temperature));

    client.publish(topic, message);

    console.log('Data published:', temperature);
  }, 5000); // 5초마다 데이터 전송
});
