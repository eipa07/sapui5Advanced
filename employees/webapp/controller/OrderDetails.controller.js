// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function (Controller, JSONModel, History) {

    function _onObjectMatched(oEvent) {
        this.getView().bindElement({
            path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
            model: "odataNorthwind"
        });
    }

    return Controller.extend("logaligroup.employees.controller.OrderDetails", {


        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);

        },

        onBack: function () {
            var oHistory = History.getInstance();
            var oPreviousHash = oHistory.getPreviousHash();

            if (oPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                oRouter.navTo("RouteMain", true);
            }
        }
    });
});