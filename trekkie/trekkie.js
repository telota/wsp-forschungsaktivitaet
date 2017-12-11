/**
 * Parses website for possible event triggers and invokes registering of events
 * @return {Bool} Success
 */
function enrichWebsite() {

    // add focus and blur events to window object in order to track researchers attention
    window.addEventListener(
        'blur', 
        (e) => {
            parser = new BrowserAttentionParser(e);
            eventInfo = parser.evntInfo;
            console.log('researcher went away');
            submitEvnt(eventInfo);
        }
    );

    // elements which were given an data-event attribute in the Django template
    let eventOwners = document.querySelectorAll('[data-event-owner]');

    for (var owner of eventOwners) {
        registerListener(owner);
    }

}

/**
 * Parses an event-owner element and registers corresponding listeners
 * @param {HTMLNode} elem
 * @return {Bool} Success
 */
function registerListener(elem) {

    let parsers = {
                 'ui-results-query': UiResultsQueryParser,
                 'ui-results-item-title': UiResultsItemTitleParser,
                 'ui-results-item-info': UiResultsItemInfoParser,
                 'ui-results-item-proj': UiResultsItemProjParser,
                 'ui-results-item-person': UiResultsItemPersonParser,
                 'ui-results-item-place': UiResultsItemPlaceParser,
                 'ui-results-item-entity': UiResultsItemEntityParser,
                 'ui-results-filter-apply': UiResultsFilterApplyParser,
                 'ui-results-filter-lang': UiResultsFilterLangParser,
    };

    // the type of event according to wsp event type taxonomie
    let evntType = elem.getAttribute('data-event-owner'); 

    elem.addEventListener(
        'click',
        (e) => {
            // call context information parser that corresponds with event type
            let parser = new parsers[evntType](e);
            eventInfo = parser.evntInfo;
            console.log(`eventInfo: ${eventInfo}`);
            submitEvnt(eventInfo);
        }
    );
}

/**
 * Parser Prototype
 * @constructs
 */
class EvntParser {
    constructor(e) {
        this._evntInfo = {};
        this._evntInfo.time = this.constructor.evntTimerfc1123();
        this._evntInfo.type = 'event';
        this._evntInfo.researcherID = localStorage.getItem('researcherID');
    }
    set evntInfo(e) {
        this._evntInfo.type = 'event';
    }
    get evntInfo() {
        return JSON.stringify(this._evntInfo);
    }

    static evntTimerfc1123() {
        let timeStmp = new Date();
        return timeStmp.toUTCString();
    }
}

class BrowserAttentionParser extends EvntParser {
    constructor(e) {
        super(e);
        let type = e.type;
        console.log(`event-type: ${type}`);
        this._evntInfo.type = `browser-${type}`;
    }
}

/**
 * Parser for Parsing ui-results-item-info events
 * @constructs
 * @arg {Event} e - generische Event Informationen
 */
class UiResultsQueryParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-query';
    }
}

class UiResultsItemTitleParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-item-title';
    }
}

class UiResultsItemInfoParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-item-info';
    }
}

class UiResultsItemProjParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-item-proj';
    }
}

class UiResultsItemPersonParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-item-person';
    }
}

class UiResultsItemPlaceParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-item-place';
    }
}

class UiResultsItemEntityParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-item-entity';
    }
}

class UiResultsFilterApplyParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-filter-apply';
    }
}

class UiResultsFilterCreatorParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-filter-creator';
    }
}

class UiResultsFilterProjectParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-filter-project';
    }
}

class UiResultsFilterLangParser extends EvntParser {
    constructor(e) {
        super(e);
        this._evntInfo.type = 'ui-results-filter-lang';
    }
}

/**
 * sends asynchronous post request with json event data python mongoDB connector
 * @param {json} event data
 * @return {Bool} Success
 */
function submitEvnt(evntInfo) {
    let request = new XMLHttpRequest();

    request.onload = () => {
        console.log(request.responseText);
    };

    request.error = () => {
        console.log('Something went wrong');
    };

    request.open('POST', 'http://127.0.0.1:5000/events/');
    request.setRequestHeader('Content-Type', 'application/json');
    // request.setRequestHeader('Access-Control-Allow-Origin', '*');
    // request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // request.setRequestHeader('Access-Control-Allow-Headers', '*');
    // request.setRequestHeader('Origin', 'http://127.0.0.1:8000');

    console.log(`Data to submit: ${evntInfo}`);
    data = evntInfo;
    request.send(data);
}

class Researcher {
    constructor () {
        this.researcherID = this.getResearcherID();
    }
    
    getResearcherID() {
        let researcherID = localStorage.getItem('researcherID');
        if (researcherID === null) {
            researcherID = Researcher.guid();
            // researcherID = guid();
            localStorage.setItem('researcherID', researcherID);
        }
        return researcherID;
    }

    /**
     * Helper Function to create GUIDs
     * thx to:
     * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript?page=1&tab=votes#tab-top
     */
    static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}

function trekkieInit() {
    console.log('trekkie is loaded');
    researcher = new Researcher();
    console.log(`Researcher: ${researcher.researcherID}`);
    enrichWebsite();
}
