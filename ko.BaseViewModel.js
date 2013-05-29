
(function ($, ko, undefined) {

	ko.BaseViewModel = function () {
	    var self = this;

        // current domain
	    self.domain = "http://" + window.location.host;

        // list of items
	    self.items = ko.observableArray([]);

        // object to observe form for creating new item
	    self.newItem = {};

	    self.dirtyItems = ko.computed(function () {
	        return self.items().filter(function (item) {
	            return item.dirtyFlag.isDirty();
	        });
	    });

	    self.isDirty = ko.computed(function () {
	        return self.dirtyItems().length > 0;
	    });

	    self.messages = ko.observableArray([]);

	    self.addItem = function () { };

	    self.save = function (item, url, success) {
	        $.ajax({
	            type: "post",
	            data: item,
	            url: self.domain + url,
	            success: success,
                error: self.error
	        });
	    }

	    self.saveChanges = function () { };

	    self._saveChanges = function (data, url, callback) {
	        $.ajax({
	            type: "post",
	            url: self.domain + url,
	            data: JSON.stringify(data),
	            contentType: "application/json, charset=utf-8",
	            traditional: true,
	            datatype: "json",
	            success: function (result) {
	                resetDirtyItems();
	                self.messages([result.message]);
	                if (typeof callback === "function") {
	                    callback();
	                }
	            },
                error: self.error
	        });
	    }

	    function resetDirtyItems() {
	        self.dirtyItems().map(function (item) {
	            item.dirtyFlag.reset();
	        });
	    }

	    self.removeItem = function () { };

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
	    }

	    self.deleteItem = function (item, url, success) {
	        $.ajax({
	            type: "delete",
	            url: self.domain + url,
	            data: { id: item.id },
	            success: success,
                error: self.error
	        });
	    }

	    self.load = function () { };

	    self.error = function (XHR, text, err) {
	        self.messages([text + ": " + err]);
	    };
	};

}(jQuery, ko));