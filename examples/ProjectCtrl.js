
(function (ProjectCtrl, $, ko, undefined) {
    "use strict";

    var uri = "/API/Projects";

    // observable project model
    function Project(data) {
        this.id = data.id;
        this.displayName = ko.observable(data.displayName);
        this.stage = ko.observable(data.stage);
        this.health = ko.observable(data.health);
        this.dirtyFlag = new ko.dirtyFlag(this);
    }

    // ko view model
    var ProjectsViewModel = function () {
        var self = this;
        ko.BaseViewModel.call(self);

        // observable project model for New Project form
        self.newItem = {
            displayName: ko.observable(),
            stage: ko.observable(),
            health: ko.observable()
        };

        // called when New Project form submitted
        // gets data from form, adds to self.items, submits data to server
        self.addItem = function () {
            var data = ko.toJS(self.newItem);
            self.save(data, uri, function (result) {
                data.id = result.id;
                self.items.push(new Project(data));
            });
            return false;
        };

        // updates info to server for all dirty/changed projects
        self.saveChanges = function () {
            self._saveChanges({ projects: ko.toJS(self.dirtyItems) }, uri);
        };

        // when Remove link is clicked, show dialog to confirm deletion, then delete
        self.removeItem = function (project) {
            self.confirmDeletion(function () {
                $(this).dialog("close");
                self.deleteItem(project, uri, function (result) {
                    self.items.remove(project);
                    self.messages([result.message]);
                });
            });
        };

        // loads Projects
        self.load = function () {            
            $.getJSON(self.domain + uri, function (data) {
                self.items(data.map(function (item) { return new Project(item); }));
            });
        }
    };

    $(document).ready(bind);

    // sets up view model, form validation, calls load()
    function bind() {
        var vm = new ProjectsViewModel();
        ko.applyBindings(vm);
        vm.load();
    }

} (window.ProjectCtrl = window.ProjectCtrl || {}, jQuery, ko));