# from _pytest import unittest
import unittest

from sqlalchemy.orm import Session

from oed import config, model
from oed.model import engine


class TestDB(unittest.TestCase):

    def test_config(self):
        '''assert that we are running with test configuration'''
        # config.detect_env()
        # pprint.pprint(sorted(os.environ.items()))
        assert config.config()['env'] == 'test'

    def test_store_page(self):
        sess = Session(engine)
        count_before= sess.query(model.Page).count()
        page = model.Page(first_word='slip', last_word='slop')
        with Session(engine) as sess:
            sess.add(page)
            sess.commit()
        assert sess.query(model.Page).count() == count_before + 1