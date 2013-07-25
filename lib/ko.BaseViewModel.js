(function ($, ko, undefined) {
    "use strict";

    ko.BaseViewModel = function () {
        var self = this;

        // list of items
        self.items = ko.observableArray([]);

        // object to observe form for creating new item
        self.newItem = {};

        // (optional) resets newItem properties to default (empty) values
        self.resetNewItem = function () { };

        // list of dirty (changed) items
        self.dirtyItems = ko.computed(function () {
            return self.items().filter(function (item) {
                return item.dirtyFlag.isDirty();
            });
        });

        // items have been changed (need to be saved)}
        self.isDirty = ko.computed(function () {
            return self.dirtyItems().length > 0;
        });

        // messages to display on page
        self.messages = ko.observableArray([]);

        // needs to be overridden, used to check validity of new item form
        // and call self.save if valid
        self.addItem = function () { };

        // saves item to server via POST
        self.save = function (item, url, success) {
            $.ajax({
                type: "post",
                data: JSON.stringify(item),
                contentType: "application/json",
                traditional: true,
                datatype: "json",
                url: url,
                success: success,
                error: self.error
            });
        };

        // updates an item on the server via PUT
        self.update = function (item, url, success) {
            $.ajax({
                type: "put",
                data: JSON.stringify(item),
                contentType: "application/json",
                traditional: true,
                datatype: "json",
                url: url,
                success: success,
                error: self.error
            });
        };

        // needs to be overridden, calls _saveChanges
        self.saveChanges = function () { };

        // saves changes to list of items to server
        self._saveChanges = function (data, url, callback) {
            $.ajax({
                type: "put",
                data: JSON.stringify(data),
                contentType: "application/json",
                traditional: true,
                datatype: "json",
                url: url,
                success: function (result) {
                    resetDirtyItems();
                    if (result.message) {
                        self.messages([result.message]);
                    }
                    if (typeof callback === "function") {
                        callback();
                    }
                },
                error: self.error
            });
        };

        // resets dirty items
        function resetDirtyItems() {
            self.dirtyItems().map(function (item) {
                item.dirtyFlag.reset();
            });
        }

        // needs to be overridden, used to remove item from list, call deleteItem
        self.removeItem = function () { };

        // shows a pop-up dialog to confirm deletion of item
        self.confirmDeletion = function (callback) {
            $("#dialog").dialog({
                resizable: false,
                modal: true,
                buttons: {
                    "Delete": callback,
                    Cancel: function () {
                        $(this).dialog("close");
                    }
                }
            });
        };

        // deletes item on server
        self.deleteItem = function (item, url, success) {
            $.ajax({
                type: "delete",
                data: item ? JSON.stringify({ id: item.id }) : {},
                url: url,
                success: success,
                error: self.error
            });
        };

        // needs to be overridden, initial load of items from server
        self.load = function () { };

        // generic error function to use in ajax calls
        self.error = function (XHR, text, err) {
            self.messages([text + ": " + err]);
        };
    };
}(jQuery, ko));
