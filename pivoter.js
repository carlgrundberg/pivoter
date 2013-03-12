Votes = new Meteor.Collection("votes");
Settings = new Meteor.Collection("settings");

if (Meteor.isClient) {
    Template.status.votes = function () {
        return Votes.find().count();
    };

    Template.page.events({
        'click .reset':function (event) {
            event.preventDefault();
            Votes.remove({});
            Session.set('showResults', false);
        }
    });

    Template.grid.items = function () {
        return [
            { value:0, label:0 },
            { value:1, label:1 },
            { value:2, label:2 },
            { value:3, label:3 },
            { value:5, label:5 },
            { value:8, label:8 },
            { value:13, label:13 },
            { value:21, label:21 },
            { value:35, label:34 },
            { value:55, label:55 },
            { value:100, label:'?' },
            { value:200, label:'<img src="cup.png" />' }
        ];
    };

    Template.griditem.active = function () {
        var vote = Votes.findOne({ user: Meteor.userId() });
        return vote && this.value == vote.value;
    };

    Template.griditem.events({
        'click':function (event) {
            event.preventDefault();
            if (Meteor.user()) {
                var vote = Votes.findOne({ user: Meteor.userId() });
                if (vote) {
                    Votes.remove(vote._id);
                }
                Votes.insert({ user: Meteor.userId(), value:event.target.rel })
            }
        }
    });

    Template.page.desktop = function() {
        return getWidth() > 1024;
    };

    Template.results.showResults = function() {
        return Session.equals('showResults', true);
    };

    Template.results.hasVotes = function() {
        return Votes.find().count() > 0;
    };

    Template.results.voteResult = function() {
        return _.countBy(Votes.find().fetch(), 'value');
    };

    Template.results.events({
        'click .show': function(event) {
            event.preventDefault();
            Session.set('showResults', true);
        }
    });

    Template.bar.width = function() {
        return this.value * 100;
    };

    Handlebars.registerHelper("key_value", function(obj, fn) {
        var buffer = "", key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                buffer += Spark.labelBranch(key, function () {
                    return fn({key: key, value: obj[key]});
                });
            }
        }

        return buffer;
    });

    function getWidth() {
        if (self.innerWidth) {
            return self.innerWidth;
        }
        else if (document.documentElement && document.documentElement.clientHeight){
            return document.documentElement.clientWidth;
        }
        else if (document.body) {
            return document.body.clientWidth;
        }
        return 0;
    }
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Votes.remove({});
    });
}



