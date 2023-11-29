import requests
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
                    visibility = visibility_cell.text.strip()
                    return f"도시: {current_city_name}, 시정(가시성): {visibility}Km"
                else:
                    return f"도시: {DESIRED_CITY}의 시정(가시성) 정보를 찾을 수 없습니다."

    return f"도시: {DESIRED_CITY}를 찾을 수 없습니다."

# 원하는 도시의 가시성 정보를 가져오기
result = get_visibility()
print(result)
