sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageToast} MessageToast
     * @params {typeof sap.ui.core.UIComponent} UIComponent
     */
    function (Controller, MessageToast, UIComponent) {
        "use strict";

        function onInit() {

        };

        function toCrearEmpleado() {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteCrearEmpleado", {});
        };

        function toVerEmpleado() {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteVerEmpleado", {}, false);
        };




        var EmployeeDetails = Controller.extend("lfinal.empleados.controller.Main", {});

        EmployeeDetails.prototype.onInit = onInit;
        EmployeeDetails.prototype.toCrearEmpleado = toCrearEmpleado;
        EmployeeDetails.prototype.toVerEmpleado = toVerEmpleado;


        return EmployeeDetails;


    });
