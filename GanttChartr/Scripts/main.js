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

    var dateRangeHandler = new DateRangeHandler(new Date(2014, 0, 1), new Date(2015, 0, 1));
    dateRangeHandler.GenerateDataStructure();
    var data = {};
    data.Header = dateRangeHandler.dataStructure.Header;
    data.Rows = [];

    for (var i = 0; i <= 100; i++) {
        data.Rows.push(dateRangeHandler.dataStructure.row);
    }
    data.Rows.push(dateRangeHandler.dataStructure.row);

    var boundView = templatr.bind("calendar", data);
    document.getElementById("content").appendChild(boundView);
};