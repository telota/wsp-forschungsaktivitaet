X_DOMAINS = '*'
X_HEADERS = ['Content-type', 'Origin']
X_EXPOSE_HEADERS = ['Access-Control-Allow-Origin', 'Content-Type',
                    'Content-Length']
X_ALLOW_CREDENTIALS = True
PUBLIC_METHODS = ['GET', 'PUT', 'DELETE']
PUBLIC_ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']

MONGO_HOST = 'localhost'
MONGO_PORT = '27017'

MONGO_USERNAME = USERNAME
MONGO_PASSWORD = PASSWORD
MONGO_DBNAME = 'wsp_test_data'

RESOURCE_METHODS = ['GET', 'POST']
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']

schema = {
    'time': {
        'type': 'datetime',
        'required': True,
    },
    'type': {
        'type': 'string',
        'minlength': 4,
        'maxlength': 50,
    },
    'researcherID': {
        'type': 'string',
        'regex': \
        '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
    },
}

events = {
    'item_title': 'event',

    'additional_lookup': {
        'url': 'regex("[\w-]+")',
        'field': 'type'
    },

    'cache_control': 'max-age=10,must-revalidate',
    'cache_expires': 10,

    'resource_methods': ['GET', 'POST'],

    'schema': schema
}

DOMAIN = {
    'events': events
}
