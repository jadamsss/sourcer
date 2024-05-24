from pathlib import Path
from datetime import datetime
import sys

import scrapy

# https://www.acehardware.com/departments/tools/Milwaukee?startIndex=30&pageSize=30&_mz_partial=true&includeFacets=false

class BrandsSpider(scrapy.Spider):
    name = "brand_products"
    date = datetime.now().strftime("%Y-%m-%d")
    brands = ['Milwaukee']
    
    def __init__(self):
        self.brand = self.brands[0]

        # if self.brand not in self.brands:
        #     raise ValueError(f"Brand '{self.brand}' is not supported")

    def start_requests(self):
        brand = sys.argv[-1]
        page_size = 30
        start_index = 0
        total_products = 2070

        urls = []

        for i in range(0, total_products, page_size):
            url = f"https://www.acehardware.com/departments/tools/{self.brand}?startIndex={i}&pageSize={page_size}&_mz_partial=true&includeFacets=false"
            urls.append(url)

        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        page_number = int(response.url.split('?')[1].split('&')[0].split('=')[1]) // 30

        output_file = Path(f"output/AceHardware/{self.date}/{self.brand}/{page_number}.html")
        output_file.parent.mkdir(exist_ok=True, parents=True)
        output_file.write_bytes(response.body)