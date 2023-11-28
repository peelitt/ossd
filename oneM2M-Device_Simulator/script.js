// 사용할 라이브러리 가져오기
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 서버 URL 및 기본 템플릿
const serverUrl = '<http://172.21.48.1:7579>';  // 적절한 서버 URL로 대체
let templates;

// 서버로부터 템플릿 및 디바이스 목록 가져오기
axios.get(`${serverUrl}/templates`)
  .then(response => {
    templates = response.data;
    console.log('Templates:', templates);
    displayDevices();
    setInterval(displayDevices, 2000);
  })
  .catch(error => console.error('Error fetching templates:', error));

// 디바이스 목록을 표시하는 함수
function displayDevices() {
  axios.get(`${serverUrl}/devices`)
    .then(response => {
      const devices = response.data;
      console.log('Devices:', devices);
      // 여기에 디바이스 목록을 표시하는 로직 추가
    })
    .catch(error => console.error('Error fetching devices:', error));
}

// 새로운 디바이스 생성 함수
function createDevice(type, name) {
  axios.post(`${serverUrl}/devices?type=${type}&name=${name}`)
    .then(response => {
      console.log('Device created successfully');
      displayDevices();
    })
    .catch(error => console.error('Error creating device:', error));
}

// 디바이스 업데이트 함수
function updateDevice(name, typeIndex, value) {
  axios.post(`${serverUrl}/devices/${name}?typeIndex=${typeIndex}&value=${value}`)
    .then(response => {
      console.log('Device updated successfully');
      displayDevices();
    })
    .catch(error => console.error('Error updating device:', error));
}

// 디바이스 삭제 함수
function deleteDevice(name) {
  axios.delete(`${serverUrl}/devices/${name}`)
    .then(response => {
      console.log('Device deleted successfully');
      displayDevices();
    })
    .catch(error => console.error('Error deleting device:', error));
}

// 사용자 입력 받기
rl.question('Enter command (create/update/delete/exit): ', function (command) {
  if (command === 'exit') {
    rl.close();
  } else if (command === 'create') {
    // 사용자로부터 입력 받기
    rl.question('Enter device type: ', function (type) {
      rl.question('Enter device name: ', function (name) {
        createDevice(type, name);
        rl.close();
      });
    });
  } else if (command === 'update') {
    // 사용자로부터 입력 받기
    rl.question('Enter device name: ', function (name) {
      rl.question('Enter type index: ', function (typeIndex) {
        rl.question('Enter value: ', function (value) {
          updateDevice(name, typeIndex, value);
          rl.close();
        });
      });
    });
  } else if (command === 'delete') {
    // 사용자로부터 입력 받기
    rl.question('Enter device name: ', function (name) {
      deleteDevice(name);
      rl.close();
    });
  } else {
    console.log('Invalid command');
    rl.close();
  }
});

rl.on('close', function () {
  console.log('Exiting...');
  process.exit(0);
});
