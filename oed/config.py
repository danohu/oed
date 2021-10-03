import os
import socket
import sys

base_config = {}

test_config = base_config.copy()
test_config.update({
    'dburl': 'sqlite+pysqlite:////home/src/oed/local/db_test.sqlite',
    'env': 'test',
})
dev_config = base_config.copy()
dev_config.update({
    'dburl': 'sqlite+pysqlite:////home/src/oed/local/db_dev.sqlite',
    'env': 'dev',
})
prod_config = base_config.copy()
prod_config.update({
    'dburl': 'sqlite+pysqlite:///home/src/oed/local/db_prod.sqlite',
    'env': 'prod'
})

envs = {
    'test': test_config,
    'dev': dev_config,
    'prod': prod_config}


def config():
    '''
    as a function to enable easily changing it after things
    have been loaded
    '''
    return CURRENT_ENV


def set_env(env: str):
    global CURRENT_ENV
    assert env in envs
    CURRENT_ENV = envs[env]


CURRENT_ENV = envs['test']


def detect_env():
    if "PYTEST_CURRENT_TEST" in os.environ:
        set_env('test')
    elif set(('unittest', 'pytest')).intersection(set(sys.modules.keys())):
        set_env('test')
    elif socket.gethostname() == 'xps':
        set_env('dev')
    else:
        set_env('prod')


detect_env()


# XXX the below should be better integrated into the config setup
from google.oauth2 import service_account

creds_path = '/home/src/oed/creds.json'

creds = service_account.Credentials.from_service_account_file(creds_path)
