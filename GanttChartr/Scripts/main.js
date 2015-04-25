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

    var boundView = templatr.bind("calendar", testData1);
    document.getElementById("content").appendChild(boundView);
};