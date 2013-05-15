Votes = new Meteor.Collection("votes");

// should be array, but cant figure out how to use 'this' in selectedItem
GridItems = {
    0:0,
    1:1,
    2:2,
    3:3,
    4:5,
    5:8,
    6:13,
    7:21,
    8:34,
    9:55,
    10:'?',
    11:'<img src="cup.png" />' };

if (Meteor.isClient) {
    Template.status.votes = function () {
        return Votes.find().count();
    };

    Template.page.events({
        'click .reset':function (event) {
            event.preventDefault();
            Votes.find().forEach(function(vote) {
                Votes.remove(vote._id);
            });
            Session.set('showResults', false);
        }
    });

    Template.grid.items = function () {
        return GridItems;
    };

    Template.griditem.selectedItem = function () {
        var vote = Votes.findOne({ user:Meteor.userId() });
        return vote && this.value == vote.value;
    };

    Template.griditem.events({
        'click':function (event) {
            event.preventDefault();
            if (Meteor.user()) {
                var vote = Votes.findOne({ user:Meteor.userId() });
                if (vote) {
                    Votes.remove(vote._id);
                }
                Votes.insert({ user:Meteor.userId(), value:this.value });
            }
        }
    });

    Template.page.desktop = function () {
        return Session.get("width") > 400;
    };

    Template.results.showResults = function () {
        return Session.equals('showResults', true);
    };

    Template.results.hasVotes = function () {
        return Votes.find().count() > 0;
    };

    Template.results.voteResult = function () {
        return _.countBy(Votes.find().fetch(), 'value');
    };

    Template.results.events({
        'click .show':function (event) {
            event.preventDefault();
            Session.set('showResults', true);
        }
    });

    Template.bar.width = function () {
        return this.value * 100;
    };

    Handlebars.registerHelper("key_value", function (obj, fn) {
        var buffer = "", key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                buffer += Spark.labelBranch(key, function () {
                    return fn({key:key, value:obj[key]});
                });
            }
        }

        return buffer;
    });

    Meteor.startup(function() {
        Session.set("width", $(window).width());
        $(window).resize(function(evt) {
            Session.set("width", $(window).width());
        });
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    });
}



