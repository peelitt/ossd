import requests
from ..  import app
from bs4 import BeautifulSoup

# oneM2M 서버 설정
cseURL = "http://127.21.48.1:7579/Mobius2"
cseRelease = "1"  # release 값이 필요하면 설정, 필요 없으면 빈 문자열로 남겨둘 수 있습니다.

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

# 원하는 도시 이름과 시정(가시성)을 가져오기
desired_city = "서울"

for row in rows:
    # 각 행의 첫 번째 셀에서 도시 이름 가져오기
    city_cell = row.find("td")
    
    # None 체크 추가
    if city_cell is not None:
        city_name = city_cell.text.strip()

        # 도시 이름이 원하는 도시와 일치하는 경우
        if city_name == desired_city:
            # 행에서 시정(가시성) 가져오기
            visibility_cell = row.find_all("td")[2]  # 시정(가시성)이 있는 열의 인덱스
            
            # None 체크 추가
            if visibility_cell is not None:
                visibility = visibility_cell.text.strip()

                # 가져온 데이터 출력
                print(f"도시: {city_name}, 시정(가시성): {visibility}Km")

                # oneM2M 서버로 데이터 전송
                typeIndex = 3  # templates에서 Visibility에 해당하는 인덱스
                app.updateDevice(typeIndex, "서울", visibility)
                
            else:
                print(f"도시: {desired_city}의 시정(가시성) 정보를 찾을 수 없습니다.")
            
            break