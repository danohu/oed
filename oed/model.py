import sqlalchemy
from sqlalchemy import Column, Integer, UnicodeText, Unicode
from sqlalchemy.orm import Session

from oed.config import config

engine = sqlalchemy.create_engine(config()['dburl'], echo=True, future=True)
metadata = sqlalchemy.MetaData(bind=engine)
Base = sqlalchemy.orm.declarative_base(metadata=metadata, )
#%%

class Page(Base):

    __tablename__ = 'page'

    id = Column(Integer, primary_key=True)
    text = Column(UnicodeText) # XXX full text indexing
    first_word = Column(Unicode)
    last_word = Column(Unicode)
    source_url = Column(Unicode)

#%%
Base.metadata.create_all(checkfirst=True)




