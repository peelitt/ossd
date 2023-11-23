const mqtt = require('mqtt');

// MQTT 브로커에 연결
const client = mqtt.connect('ws://localhost:9001'); // 웹소켓 주소에 맞게 수정

// 연결 완료 이벤트
client.on('connect', () => {
    console.log('Connected to MQTT broker');

    // 특정 토픽에 메시지 발행
    client.publish('data', '성공?!');

    // 연결 종료
    client.end();
});

// 에러 이벤트
client.on('error', (err) => {
    console.error('Error:', err);
});