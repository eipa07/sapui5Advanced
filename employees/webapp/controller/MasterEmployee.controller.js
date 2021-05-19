// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        function onInit() {

            this._bus = sap.ui.getCore().getEventBus();
            

        }

        function onFilter(){
            var oJsonCountry = this.getView().getModel("jsonCountries").getData();

            var filters = [];

            if(oJsonCountry.EmployeeId !== ''){
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJsonCountry.EmployeeId));
            }

            if(oJsonCountry.CountryKey !== ''){
                filters.push(new Filter("Country", FilterOperator.EQ, oJsonCountry.CountryKey));
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }

        function onClearFilter(){
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        }

        function showPostalCode(oEvent){
            var itemPresed = oEvent.getSource();
            var oContext = itemPresed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();

            sap.m.MessageToast.show(objectContext.PostalCode);
        }


        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);

        }

        function onHideCity(){
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        }

        function onCloseOrders(){
            this._oDialogOrders.close();
        }

        function showOrders(oEvent){

            //Get selected controller
            var iconPressed = oEvent.getSource();

            //Context from the model
            var oContext = iconPressed.getBindingContext("jsonEmployees");

            if(!this._oDialogOrders){
                this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrders);
            }

            //Dialog binding to the context to have accessto the data of selected item
            this._oDialogOrders.bindElement("jsonEmployees>" + oContext.getPath());
            this._oDialogOrders.open();


            // var ordersTable = this.getView().byId("ordersTable");

            // ordersTable.destroyItems();

            // var itemPressed = oEvent.getSource();
            // var oContext = itemPressed.getBindingContext("jsonEmployees");

            // var objectContext = oContext.getObject();
            // var orders = objectContext.Orders;

            // var ordersItems = [];

            // for (var i in orders) {
            //     ordersItems.push(new sap.m.ColumnListItem({
            //         cells: [
            //             new sap.m.Label({ text: orders[i].OrderID }),
            //             new sap.m.Label({ text: orders[i].Freight }),
            //             new sap.m.Label({ text: orders[i].ShipAddress })
            //         ]
            //     }));
            // }

            // var newTable = new sap.m.Table({
            //     width: "auto",
            //     columns: [
            //         new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
            //         new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
            //         new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) })
            //     ],
            //     items: ordersItems
            // }).addStyleClass("sapUiSmallMargin");


            // ordersTable.addItem(newTable);

            // var newTableJSON = new sap.m.Table();
            // newTableJSON.setWidth("auto");
            // newTableJSON.addStyleClass("sapUiSmallMargin");

            // var columnOrderID = new sap.m.Column();
            // var labelOrderID  = new sap.m.Label();
            // labelOrderID.bindProperty("text", "i18n>orderID");
            // columnOrderID.setHeader(labelOrderID);
            // newTableJSON.addColumn(columnOrderID);

            // var columnFreight = new sap.m.Column();
            // var labelFreight  = new sap.m.Label();
            // labelFreight.bindProperty("text", "i18n>freight");
            // columnFreight.setHeader(labelFreight);
            // newTableJSON.addColumn(columnFreight);

            // var columnShipAddress = new sap.m.Column();
            // var labelShipAddress  = new sap.m.Label();
            // labelShipAddress.bindProperty("text", "i18n>shipAddress");
            // columnShipAddress.setHeader(labelShipAddress);
            // newTableJSON.addColumn(columnShipAddress);

            // var columnListItem = new sap.m.ColumnListItem();

            // var cellOrderID = new sap.m.Label();
            // cellOrderID.bindProperty("text", "jsonEmployees>OrderID");
            // columnListItem.addCell(cellOrderID);

            // var cellFreight = new sap.m.Label();
            // cellFreight.bindProperty("text", "jsonEmployees>Freight");
            // columnListItem.addCell(cellFreight);

            // var cellShipAddress = new sap.m.Label();
            // cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress");
            // columnListItem.addCell(cellShipAddress);

            // var oBindingInfo = {
            //     model : "jsonEmployees",
            //     path: "Orders",
            //     template: columnListItem
            // };

            // newTableJSON.bindAggregation("items", oBindingInfo);
            // newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());

            // ordersTable.addItem(newTableJSON);

        }

        function showEmployee(oEvent){
            var path = oEvent.getSource().getBindingContext("jsonEmployees").getPath();
            this._bus.publish("flexible", "showEmployee", path);
        }



        var Main = Controller.extend("logaligroup.employees.controller.MasterEmployee", {});

        Main.prototype.onValidate = function () {

            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                //inputEmployee.setDescription("OK");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);
            } else {
                //inputEmployee.setDescription("fail");
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            }

        };


        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee = showEmployee;
        return Main;
    });
