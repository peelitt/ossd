import requests
from bs4 import BeautifulSoup

# 크롤링할 사이트의 URL
url = "https://www.weather.go.kr/w/obs-climate/land/city-obs.do"

# requests를 사용하여 페이지 내용 가져오기
response = requests.get(url)
html = response.text

# BeautifulSoup을 사용하여 HTML 파싱
soup = BeautifulSoup(html, "html.parser")

# 원하는 테이블을 선택
target_table = soup.find("table", class_="table-col tablesorter tablesorter-blue tablesorterb64d842dc37fe")

# 특정 행을 선택
desired_row = target_table.find_all("tr")[42]

# 선택한 행의 모든 셀(cells)을 가져오기
cells_in_desired_row = desired_row.find_all("td")

# 특정 셀(index 1)의 데이터 출력
desired_cell_data = cells_in_desired_row[1].text
print(desired_cell_data)
