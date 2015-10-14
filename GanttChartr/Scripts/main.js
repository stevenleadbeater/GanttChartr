function Main() {
    this.templatr = new Templatr("test");
};

Main.prototype.Initialize = function () {

    $.ajax({
        type: "GET",
        url: "Views/CalendarGrid.html",
        success: this.HandleMasterViewReturn.bind(this)
    });
};

Main.prototype.HandleMasterViewReturn = function (response) {

    $.ajax({
        type: "GET",
        url: "Views/CalendarHeader1.html",
        success: this.HandleHeaderViewReturn.bind(this, response)
    });
};

Main.prototype.HandleHeaderViewReturn = function (response, headerView) {

    $.ajax({
        type: "GET",
        url: "Views/CalendarDetails1.html",
        success: this.HandleViewReturn.bind(this, headerView, response)
    });
};

var averages = {
    update: {
        count: 0,
        values: []
    }
}

var setAverage = function (modelNumber, timeElapsed) {
    averages["update"].count++;
    averages["update"].values.push(timeElapsed);
    var total = 0;
    for (var i in averages["update"].values) { total += averages["update"].values[i]; }
    return (total / averages["update"].count);
}


Main.prototype.HandleViewReturn = function (headerView, masterView, detailView) {
    try {
        var t1 = window.performance.now();
    } catch (ex) {
        var t1 = new Date().getTime();
    }
    this.templatr.addView("calendar", masterView);
    this.templatr.addView("header", headerView);
    this.templatr.addView("detail", detailView);

    var dateRangeHandler = new DateRangeHandler(new Date(2015, 0, 1), new Date(2015, 3, 0));
    dateRangeHandler.GenerateDataStructure();

    var data = {};
    data.Header = dateRangeHandler.dataStructure.Header;
    data.Rows = [];


    var eventController = new EventController(dateRangeHandler);
    eventController.LoadData([
    {
        displayText: "parent",
        id: "1",
        toolTip: "parent tip",
        isCalculated: true,
        showGapsFromChildren: true,
        showAdditiveArea: false,
        children: [{
            blocks: [
                {
                    startDate: new Date(2015, 0, 1),
                    endDate: new Date(2015, 1, 0),
                    id: "001"
                },
                {
                    startDate: new Date(2015, 2, 1),
                    endDate: new Date(2015, 3, 0),
                    id: "002"
                }],
            displayText: "child 1",
            id: "1.1",
            toolTip: "child 1 tip",
            isCalculated: false,
            children: []
        }, {
            blocks: [
                {
                    startDate: new Date(2015, 0, 1),
                    endDate: new Date(2015, 1, 0),
                    id: "003"
                },
                {
                    startDate: new Date(2015, 2, 1),
                    endDate: new Date(2015, 3, 0),
                    id: "004"
                }],
            displayText: "child 2",
            id: "1.2",
            toolTip: "child 2 tip",
            isCalculated: false,
            children: []
        }]
    },
    {
        displayText: "parent",
        id: "1",
        toolTip: "parent tip",
        isCalculated: true,
        showGapsFromChildren: true,
        showAdditiveArea: false,
        children: [{
            blocks: [
                {
                    startDate: new Date(2015, 0, 1),
                    endDate: new Date(2015, 1, 0),
                    id: "005"
                },
                {
                    startDate: new Date(2015, 2, 1),
                    endDate: new Date(2015, 3, 0),
                    id: "006"
                }],
            displayText: "child 1",
            id: "1.1",
            toolTip: "child 1 tip",
            isCalculated: false,
            children: []
        }, {
            blocks: [
                {
                    startDate: new Date(2015, 0, 1),
                    endDate: new Date(2015, 1, 0),
                    id: "007"
                },
                {
                    startDate: new Date(2015, 2, 1),
                    endDate: new Date(2015, 3, 0),
                    id: "008"
                }],
            displayText: "child 2",
            id: "1.2",
            toolTip: "child 2 tip",
            isCalculated: false,
            children: []
        }]
    }]);

    data.Rows = eventController.rows;

    var boundView = this.templatr.bind("calendar", data);
    document.getElementById("content").appendChild(boundView);
    try {
        var t2 = window.performance.now();
    } catch (ex) {
        var t2 = new Date().getTime();
    }
    document.getElementById("initialLoad").innerText = setAverage(1, (t2 - t1));

    var draggableElems = document.querySelectorAll('.draggable');
    // array of Draggabillies
    var draggies = []
    // init Draggabillies
    for (var i = 0, len = draggableElems.length; i < len; i++) {
        var draggableElem = draggableElems[i];
        var draggie = new Draggabilly(draggableElem, {
            // options...
            grid: [21, 24],
            axis: 'x'
        });

        var start;

        draggie.on('dragStart', function (event, pointer) {
            start = pointer.srcElement.offsetLeft;
        }.bind(this));

        draggie.on('dragEnd', function (event, pointer) {
            //alert((pointer.srcElement.offsetLeft - start) / 21);
            var propertiesToWalk = pointer.srcElement.attributes["data-accesor"].value.split(".");
            var event = null;
            var modelProperty = null;
            var addToNext = false;
            for (var i = 0, len = propertiesToWalk.length; i < len; i++) {
                if (propertiesToWalk[i] !== "") {
                    if (modelProperty === null) {
                        modelProperty = this.templatr.Model[propertiesToWalk[i]];
                    } else {

                        modelProperty = modelProperty[propertiesToWalk[i]];
                        if (addToNext) {
                            propertiesToWalk[i] = (parseInt(propertiesToWalk[i]) + (pointer.srcElement.offsetLeft - start) / 21).toString();
                            addToNext = false;
                        }
                        if (propertiesToWalk[i] === "days") {
                            addToNext = true;
                        } else if (propertiesToWalk[i] === "events") {
                            event = modelProperty.splice(propertiesToWalk[i + 1], 1)[0];
                            modelProperty = null;
                            break;
                        }
                    }
                }
            }

            for (var i = 0, len = propertiesToWalk.length; i < len; i++) {
                if (propertiesToWalk[i] !== "") {
                    if (modelProperty === null) {
                        modelProperty = this.templatr.Model[propertiesToWalk[i]];
                    } else {

                        modelProperty = modelProperty[propertiesToWalk[i]];

                        if (propertiesToWalk[i] === "events") {
                            while (modelProperty.length > 1) {
                                modelProperty.pop();
                            }
                            modelProperty.push(event);
                            break;
                        }
                    }
                }
            }

            //this.templatr.updateDataModel(this.templatr.Model);
            document.getElementById("content").removeChild(document.getElementById("content").firstChild);

            var boundView = this.templatr.bind("calendar", this.templatr.Model);
            document.getElementById("content").appendChild(boundView);
        }.bind(this));

        draggies.push(draggie);
    }

    //var counter = 0;
    //setInterval(function () {
    //    try {
    //        var t1 = window.performance.now();
    //    } catch (ex) {
    //        var t1 = new Date().getTime();
    //    }

    //    var data = {};
    //    data.Header = dateRangeHandler.dataStructure.Header;
    //    data.Rows = []; 

    //    if (counter === 0) {
    //        counter = 1;
    //        data.Rows = [];

    //        var eventController = new EventController(dateRangeHandler);
    //        eventController.LoadData([
    //        {
    //            displayText: "parent",
    //            id: "1",
    //            toolTip: "parent tip",
    //            isCalculated: true,
    //            showGapsFromChildren: true,
    //            showAdditiveArea: false,
    //            children: [{
    //                blocks: [
    //                    {
    //                        startDate: new Date(2015, 0, 1),
    //                        endDate: new Date(2015, 1, 0)
    //                    }],
    //                displayText: "child 1",
    //                id: "1.1",
    //                toolTip: "child 1 tip",
    //                isCalculated: false,
    //                children: []
    //            }, {
    //                blocks: [
    //                    {
    //                        startDate: new Date(2015, 0, 29),
    //                        endDate: new Date(2015, 1, 20)
    //                    }],
    //                displayText: "child 2",
    //                id: "1.2",
    //                toolTip: "child 2 tip",
    //                isCalculated: false,
    //                children: []
    //            }]
    //        },
    //        {
    //            displayText: "parent",
    //            id: "1",
    //            toolTip: "parent tip",
    //            isCalculated: true,
    //            showGapsFromChildren: true,
    //            showAdditiveArea: false,
    //            children: [{
    //                blocks: [
    //                    {
    //                        startDate: new Date(2015, 0, 1),
    //                        endDate: new Date(2015, 1, 0)
    //                    }],
    //                displayText: "child 1",
    //                id: "1.1",
    //                toolTip: "child 1 tip",
    //                isCalculated: false,
    //                children: []
    //            }, {
    //                blocks: [
    //                    {
    //                        startDate: new Date(2015, 0, 29),
    //                        endDate: new Date(2015, 1, 20)
    //                    }],
    //                displayText: "child 2",
    //                id: "1.2",
    //                toolTip: "child 2 tip",
    //                isCalculated: false,
    //                children: []
    //            }]
    //        }]);
    //        data.Rows = eventController.rows;
    //    } else {
    //        counter = 0;
    //        data.Rows = [];

    //        var eventController = new EventController(dateRangeHandler);
    //        eventController.LoadData([
    //        {
    //            displayText: "parent",
    //            id: "1",
    //            toolTip: "parent tip",
    //            isCalculated: true,
    //            showGapsFromChildren: true,
    //            showAdditiveArea: false,
    //            children: [{
    //                blocks: [
    //                    {
    //                        startDate: new Date(2015, 0, 1),
    //                        endDate: new Date(2015, 1, 0)
    //                    }],
    //                displayText: "child 1",
    //                id: "1.1",
    //                toolTip: "child 1 tip",
    //                isCalculated: false,
    //                children: []
    //            }, {
    //                blocks: [
    //                    {
    //                        startDate: new Date(2015, 2, 1),
    //                        endDate: new Date(2015, 3, 0)
    //                    }],
    //                displayText: "child 2",
    //                id: "1.2",
    //                toolTip: "child 2 tip",
    //                isCalculated: false,
    //                children: []
    //            }]
    //        },
    //        {
    //            displayText: "parent",
    //            id: "1",
    //            toolTip: "parent tip",
    //            isCalculated: true,
    //            showGapsFromChildren: true,
    //            showAdditiveArea: false,
    //            children: [{
    //                blocks: [
    //                    {
    //                        startDate: new Date(2015, 0, 1),
    //                        endDate: new Date(2015, 1, 0)
    //                    }],
    //                displayText: "child 1",
    //                id: "1.1",
    //                toolTip: "child 1 tip",
    //                isCalculated: false,
    //                children: []
    //            }, {
    //                blocks: [
    //                    {
    //                        startDate: new Date(2015, 2, 1),
    //                        endDate: new Date(2015, 3, 0)
    //                    }],
    //                displayText: "child 2",
    //                id: "1.2",
    //                toolTip: "child 2 tip",
    //                isCalculated: false,
    //                children: []
    //            }]
    //        }]);
    //        data.Rows = eventController.rows;
    //    }

    //    //document.getElementById("content").removeChild(document.getElementById("content").firstChild);

    //    //var boundView = templatr.bind("calendar", data);
    //    //document.getElementById("content").appendChild(boundView);

    //    templatr.updateDataModel(data);
    //    try {
    //        var t2 = window.performance.now();
    //    } catch (ex) {
    //        var t2 = new Date().getTime();
    //    }
    //    document.getElementById("updateAverage").innerText = setAverage(1, (t2 - t1));
    //}, 5000);
};

Main.prototype.MakeRow = function (rowTemplate, highlights) {
    var row = {}
    this.CloneObject(row, rowTemplate);

    var rowController = new RowController(row, highlights);
    rowController.SpliceData();
    return row;
}

Main.prototype.CloneObject = function (obj1, obj2) {

    //iterate over all the properties in the object which is being consumed
    for (var p in obj2) {
        // Property in destination object set; update its value.
        if (obj2.hasOwnProperty(p) && typeof obj1[p] !== "undefined") {
            this.CloneObject(obj1[p], obj2[p]);

        } else {
            //We don't have that level in the heirarchy so add it

            if (Object.prototype.toString.call(obj2[p]) === "[object Array]") {
                obj1[p] = [];
                this.CloneObject(obj1[p], obj2[p]);
            } else if (Object.prototype.toString.call(obj2[p]) === "[object Object]") {
                obj1[p] = {};
                this.CloneObject(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        }
    }
}