function Main() {

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

Main.prototype.HandleViewReturn = function (headerView, masterView, detailView) {
    var templatr = new Templatr("test");
    templatr.addView("calendar", masterView);
    templatr.addView("header", headerView);
    templatr.addView("detail", detailView);

    var dateRangeHandler = new DateRangeHandler(new Date(2015, 0, 1), new Date(2015, 3, 1));
    dateRangeHandler.GenerateDataStructure();

    var data = {};
    data.Header = dateRangeHandler.dataStructure.Header;
    data.Rows = [];
    
    data.Rows.push(this.MakeRow(dateRangeHandler.dataStructure.row, [
        {
            startDate: new Date(2015, 0, 1),
            endDate: new Date(2015, 1, 0)
        }
    ]));

    data.Rows.push(this.MakeRow(dateRangeHandler.dataStructure.row, [
        {
            startDate: new Date(2015, 0, 10),
            endDate: new Date(2015, 1, 0)
        }
    ]));

    data.Rows.push(this.MakeRow(dateRangeHandler.dataStructure.row, [
        {
            startDate: new Date(2015, 1, 0),
            endDate: new Date(2015, 2, 0)
        }
    ]));

    var boundView = templatr.bind("calendar", data);
    document.getElementById("content").appendChild(boundView);
};

Main.prototype.MakeRow = function(rowTemplate, highlights) {
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