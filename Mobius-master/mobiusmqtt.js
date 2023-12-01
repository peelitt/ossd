const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const mobiusUrl = 'http://127.21.48.1:7579';
const resourcePath = '/Mobius/speed/DATA';

async function fetchData() {
  try {
    const requestId = generateUniqueId();
    const originHeader = 'client1';

    const response = await axios.get(`${mobiusUrl}${resourcePath}`, {
      headers: {
        'X-M2M-RI': requestId,
        'X-M2M-Origin': originHeader,
      },
    });

    const data = response.data;
    const conValue = data['m2m:cnt']['con'];
    return conValue;
  } catch (error) {
    console.error('Error fetching data from Mobius:', error);
    console.log('Request details:', error.request);
  }
}

function generateUniqueId() {
  return uuidv4();
}



// MQTT 클라이언트 및 연결 설정
const mqtt = require('mqtt');
const client = mqtt.connect('ws://localhost:9001'); // 웹소켓 주소에 맞게 수정
const topic = 'data';

client.on('connect', async () => {
  setInterval(async () => {
    const data = await fetchData(); // Mobius에서 데이터 가져오기

    if (data) {
      // 데이터를 MQTT 메시지로 변환
      const message = Buffer.from(JSON.stringify(data));
      client.publish(topic, message);

      console.log('Data published:', data);
    }
  }, 5000); // 5초마다 데이터 전송
});
