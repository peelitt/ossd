import json
import threading
import schedule
import requests
import time
from bs4 import BeautifulSoup

# Constant for the desired city
DESIRED_CITY = "서울"

def get_visibility():
    # 크롤링할 사이트의 URL
    url = "https://www.weather.go.kr/w/obs-climate/land/city-obs.do"

    # requests를 사용하여 페이지 내용 가져오기
    response = requests.get(url)
    html = response.text

    # BeautifulSoup을 사용하여 HTML 파싱
    soup = BeautifulSoup(html, "html.parser")

    # 원하는 테이블 선택
    target_table = soup.find("table", class_="table-col")

    # 테이블의 모든 행(rows)을 가져오기
    rows = target_table.find_all("tr")

    for row in rows:
        # 각 행의 첫 번째 셀에서 도시 이름 가져오기
        city_cell = row.find("td")

        # None 체크 추가
        if city_cell is not None:
            current_city_name = city_cell.text.strip()

            # 도시 이름이 원하는 도시와 일치하는 경우
            if current_city_name == DESIRED_CITY:
                # 행에서 시정(가시성) 가져오기
                visibility_cell = row.find_all("td")[2]  # 시정(가시성)이 있는 열의 인덱스

                # None 체크 추가
                if visibility_cell is not None:
                    visibility = float(visibility_cell.text.strip()[:-2])  # 숫자 부분만 추출
                    print(visibility)
                    return visibility
                else:
                    return None

    return None

def update_visibility_topic():
    # 기존 설정 파일 로드
    with open('ossd_git/mqtt-simulator/config/settings.json', 'r') as json_file:
        existing_config = json.load(json_file)
    
    # 새로운 가시성 정보 가져오기
    visibility_info = get_visibility()
    
    if visibility_info is not None:
        # 토픽 이름이 "visibility"인 토픽 찾기
        visibility_topic = next((topic for topic in existing_config["TOPICS"] if topic["PREFIX"] == "visibility"), None)
        
        if visibility_topic:
            # 해당 토픽의 DATA의 VALUES에 새로운 가시성 정보 추가
            values = visibility_topic["DATA"][0]["VALUES"]
            values.insert(0, visibility_info)
            
            # 갱신된 설정을 파일에 저장
            with open('ossd_git/mqtt-simulator/config/settings.json', 'w') as json_file:
                json.dump(existing_config, json_file, indent=4)
            
            print(f"가시성 정보를 visibility 토픽의 맨 앞에 추가하였습니다: {visibility_info}")
        else:
            print("토픽 이름이 'visibility'인 토픽을 찾을 수 없습니다.")

# 주기적으로 visibility 토픽 업데이트
schedule.every(10).seconds.do(update_visibility_topic)

# background 스레드 시작
thread = threading.Thread(target=lambda: schedule.run_continuously(10))
thread.start()

# 메인 스레드는 계속해서 다른 작업을 수행 가능
while True:
    print("메인 스레드가 다른 작업 수행 중...")
    time.sleep(5)  # 메인 스레드가 다른 작업 수행 중임을 확인하기 위해 추가한 sleep

# 주기적으로 실행되는 함수 (주기는 1초)
def periodic_job():
    print("주기적으로 실행되는 작업")

# 코드 실행 예시
if __name__ == "__main__":
    # 백그라운드에서 주기적으로 실행되는 스레드 생성
    background_thread = threading.Thread(target=lambda: schedule.run_continuously(1))
    background_thread.start()

    # 메인 스레드에서 다른 작업 수행
    while True:
        print("메인 스레드가 다른 작업을 수행 중입니다.")
        time.sleep(5)  # 메인 스레드가 다른 작업 수행 중임을 확인하기 위해 추가한 sleep