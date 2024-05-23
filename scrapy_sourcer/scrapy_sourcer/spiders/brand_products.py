from pathlib import Path
from datetime import datetime

import scrapy

# https://www.acehardware.com/departments/tools/Milwaukee?startIndex=30&pageSize=30&_mz_partial=true&includeFacets=false

class BrandsSpider(scrapy.Spider):
    name = "brand_products"
    brand = "Milwaukee"
    date = datetime.now().strftime("%Y-%m-%d")

    def start_requests(self):
        page_size = 30
        start_index = 0
        total_products = 90

        urls = []

        for i in range(0, total_products, page_size):
            url = f"https://www.acehardware.com/departments/tools/{self.brand}?startIndex={i}&pageSize={page_size}&_mz_partial=true&includeFacets=false"
            urls.append(url)

        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        page_number = int(response.url.split('?')[1].split('&')[0].split('=')[1]) // 30
        brand = response.url.split('?')[0].split('/')[-1]

        output_file = Path(f"output/{self.date}/{brand}/{page_number}.html")
        output_file.parent.mkdir(exist_ok=True, parents=True)
        output_file.write_bytes(response.body)