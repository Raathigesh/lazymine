/*global module, require*/
var AppActions = require('../actions/app-actions');

module.exports = {
    InternalServerError: {
        code: "S001",
        message: "Internal server error."
    },
    DataLoadFailure: {
        code: "S002",
        message: "Data load failure, Please connect to a network."
    },
    TimeEntryFailure : {
        code: "S003",
        message: "Time entry failure."
    },
    InvalidUrl : {
        code: "S004",
        message: "Parameter baseUrl must be valid."
    },
    InvalidApiKey : {
        code: "S005",
        message: "Parameter apiKey must not be empty."
    },
    UrlOrApiKeyInvalid : {
        code: "S006",
        message: "URL or API key is invalid."
    },
    SettingsNotSet: {
        code: "S007",
        message: "Settings not available in local storage."
    },
    DataFetchInProgress: {
        code: "S008",
        message: "Cannot perform this operation, Data fetch in progress."
    },
    NoTimeEntryAvailable: {
        code: "S009",
        message: "You don't have tasks ready to update."
    }
};
