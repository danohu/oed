from google.cloud.vision_v1 import AnnotateImageResponse
from google.cloud import vision
from oed.config import creds
foo = 'bar'


class OCRPage:
    has_run = False
    page_as_protobuf: AnnotateImageResponse = 'abc' # set up mypy?

    def __init__(self, source_url: str, *args, **kwargs):
        self.client = vision.ImageAnnotatorClient(credentials=creds)
        self.source_url = source_url
        pass

    def run_ocr(self, force=False):
        if self.has_run and not force:
            return self.page_as_protobuf
        image_src = vision.ImageSource(image_uri=self.source_url)
        img = vision.Image(sourcea=image_src)
        feature = vision.Feature(
            type_=vision.Feature.Type.DOCUMENT_TEXT_DETECTION)
        self.page_as_protobuf = self.client.annotate_image({
            'image': img,
            # 'image': {'source': {'image_uri': source_uri}},
            'features': [feature]
        })
        return self.page_as_protobuf

    def wordtext(self, word):
        return ''.join(x.text for x in word.symbols)

    def paratext(self, para):
        return ' '.join(self.wordtext(x) for x in para.words)

    def firstword_text(self, para):
        return ''.join(x.text for x in para.words[0].symbols)

    def iterate_paras(self):
        doc = self.page_as_protobuf.full_text_annotation
        for page in doc.pages:
            for block in page.blocks:
                for paragraph in block.paragraphs:
                    yield paragraph

    def get_headings(self):
        """
        """
        tolerance = 5  # avoid issues where the headers are a few pixels off
        top_leftmost = None
        top_rightmost = None
        top_leftmost_coords = None
        top_rightmost_coords = None

        for paragraph in self.iterate_paras():
            # initialize
            if top_leftmost_coords is None:
                top_leftmost_coords = paragraph.bounding_box.vertices[0]
            if top_rightmost_coords is None:
                top_rightmost_coords = paragraph.bounding_box.vertices[1]

            topleft = paragraph.bounding_box.vertices[0]
            if (topleft.x - tolerance <= top_leftmost_coords.x
                    and topleft.y - tolerance <= top_leftmost_coords.y):
                top_leftmost_coords = topleft
                top_leftmost = paragraph

            topright = paragraph.bounding_box.vertices[1]
            if (topright.x + tolerance >= top_rightmost_coords.x
                    and topright.y - tolerance <= top_rightmost_coords.y):
                top_rightmost_coords = topright
                top_rightmost = paragraph

        return (top_leftmost, top_rightmost)

    def para_start_end(self):
        for para in self.iterate_paras():
            first = ''.join(x.text for x in para.words[0].symbols)
            last = ''.join(x.text for x in para.words[-1].symbols)
            print(f'{self.wordtext(para.words[0])} - {self.wordtext(para.words[-1])}')

    def headwords(self):
        '''
        Our best guess at the headwords at the top of the page
        '''
        left, right = self.get_headings()
        return self.firstword_text(left), self.firstword_text(right)


# %%
# source_uri = 'https://ohuiginn.net/tmp/singlepage-1.png'
# ocr = OCRPage(source_uri)
# pb = ocr.run_ocr()

def fubar():
    raise
    breakpoint


