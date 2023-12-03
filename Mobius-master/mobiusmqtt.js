const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const mobiusUrl = 'http://192.168.28.1:7579';
const resourcePath = '/Mobius/speed/DATA';

function generateUniqueId() {
  return uuidv4();
}

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

    // 전체 데이터를 콘솔에 출력
    console.log('Fetched raw data from DATA folder:', data);

    // m2m:cnt 데이터 구조 확인을 위해 콘솔에 출력
    const cnt = data["m2m:cnt"];
    console.log('Fetched data from DATA folder:', cnt);

    const cin = cnt && cnt['m2m:cin'];
    console.log('Fetched data from DATA:', cin);

    const conValue = data['m2m:cnt'] && data['m2m:cnt']['m2m:cin'] && data['m2m:cnt']['m2m:cin']['con'];


    if (conValue !== undefined) {
      console.log('Fetched conValue from DATA folder:', conValue);

      // m2m:cin 데이터 구조 확인을 위해 콘솔에 출력
      const cinData = data['m2m:cnt']['m2m:cin'];
      console.log('Fetched m2m:cin data from DATA folder:', cinData);

      return conValue;
    } else {
      console.log('Error: conValue is undefined');
      return null;
    }
  } catch (error) {
    console.error('Error fetching data from Mobius:', error);
    console.log('Request details:', error.request);
  }
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
  }, 3000); // 5초마다 데이터 전송
});
