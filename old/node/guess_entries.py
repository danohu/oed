#!/usr/bin/env python

'''
Guess the headwords from the OCRd text of a page of the OED
Do not include
'''
from collections import defaultdict
import re

def bagofwords(text, numchars):
    """return a dictionary of each word in the page, grouped by the
    first ``numchars`` of the word"""
    prefixes = defaultdict(list)
    for word in re.findall('[a-z]+', text.lower()):
        if len(word) > numchars:
            key = word[:numchars]
            prefixes[key].append(word)
    return prefixes

def get_headwords(text):
    '''list the (guessed) headwords, found by looking
    for the most common words on the page'''
    bag = bagofwords(text, 4)
    most_pop_headword = max(bag.iteritems(), key = lambda x: len(x[1]))
    return sorted(set(most_pop_headword[1]))

text = open('./text_sample.txt').read()

if __name__ == '__main__':
    print(get_headwords(text))

