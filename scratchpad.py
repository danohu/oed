
from oed import model
from oed.ocr import OCRPage

# page = model.Page(first_word='slip', last_word='slop')

#%%

source_url = 'https://ohuiginn.net/tmp/singlepage-1.png'
page = OCRPage(source_url)
