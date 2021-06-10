//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, MessageToast, JSONModel) {
        "use strict";



        return Controller.extend("final.empleados.controller.CrearEmpleado", {
            onInit: function () {
                this.lineWizard = this.getView().byId("CrearEmpleado");
                this.datosEmpModel = new JSONModel("datosEmpModel", {
                    tipoEmp: '',
                    lbldnicif: '',
                    lblSBA: '',
                    sliderValue: '',
                    sliderMin: '',
                    sliderMax: '',
                    step: '',
                    validarNombre: '',
                    validaApellidos: ''
                });
                this.getView().setModel(this.datosEmpModel);

                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.getView().byId("wizardNavContainer");

            },

            nextStep: function (option) {

                var currentStep = this.lineWizard.getCurrentStep();
                var step1 = this.getView().byId('Tipo_empleado');
                var step2 = this.getView().byId('Datos_empleado');
                var fecha = this.getView().byId("dpFechaInc").getValue();
                var lbldnicif, lblSBA, sliderValue, sliderMin, sliderMax, step, codeType;

                if (option === 'Interno') {
                    codeType = '0';
                    lbldnicif = this.oView.getModel("i18n").getResourceBundle().getText("dni");
                    lblSBA = this.oView.getModel("i18n").getResourceBundle().getText("saldoBrutoAnual");
                    sliderValue = 24000;
                    sliderMin = 12000;
                    sliderMax = 80000;
                    step = 1000;
                } else if (option === 'Gerente') {
                    codeType = '2';
                    lbldnicif = this.oView.getModel("i18n").getResourceBundle().getText("dni");
                    lblSBA = this.oView.getModel("i18n").getResourceBundle().getText("saldoBrutoAnual");
                    sliderValue = 70000;
                    sliderMin = 50000;
                    sliderMax = 200000;
                    step = 1000;
                } else if (option === 'Autonomo') {
                    codeType = '1';
                    lbldnicif = this.oView.getModel("i18n").getResourceBundle().getText("cif");
                    lblSBA = this.oView.getModel("i18n").getResourceBundle().getText("precioDiario");
                    sliderValue = 400;
                    sliderMin = 100;
                    sliderMax = 2000;
                    step = 100;
                }

                this.datosEmpModel.setData({
                    codeType: codeType,
                    tipoEmp: option,
                    lbldnicif: lbldnicif,
                    lblSBA: lblSBA,
                    sliderValue: sliderValue,
                    sliderMin: sliderMin,
                    sliderMax: sliderMax,
                    step: step,
                    Nombre: this.getView().byId("txtNombre").getValue(),
                    Apellido: this.getView().byId("txtApellidos").getValue(),
                    DniCif: this.getView().byId("txtdnicif").getValue(),

                    Comentario: this.getView().byId("txtAreaComentarios").getValue()

                });

                console.log(option);
                this.lineWizard.goToStep(currentStep);


                if (this.lineWizard.getCurrentStep() === step1.getId()) {
                    this.lineWizard.nextStep();
                } else {
                    this.lineWizard.goToStep(step2);
                }
            },


            validaCampos: function (oEvent, callback) {

                var txtNombre = this.getView().byId("txtNombre");
                var txtApellidos = this.getView().byId("txtApellidos");
                var txtdnicif = this.getView().byId("txtdnicif");
                var dpFechaInc = this.getView().byId("dpFechaInc");
                var data = this.datosEmpModel.getData();
                var flagValidacion = true;


                if (txtNombre.getValue() === '') {
                    console.log('Nombre vacio');
                    txtNombre.setValueState("Error");
                    flagValidacion = false;
                } else {
                    txtNombre.setValueState("None");
                }
                if (txtApellidos.getValue() === '') {
                    console.log('Apellidos vacio');
                    txtApellidos.setValueState("Error");
                    flagValidacion = false;
                } else {
                    txtApellidos.setValueState("None");
                }

                if (txtdnicif.getValue() === '') {
                    console.log('dni/cif vacio');
                    txtdnicif.setValueState("Error");
                    flagValidacion = false;
                } else {
                    txtdnicif.setValueState("None");
                }

                if (dpFechaInc.getValue() === '' || !dpFechaInc.isValidValue()) {
                    console.log('DatePicker vacio');
                    dpFechaInc.setValueState("Error");
                    flagValidacion = false;
                } else {
                    dpFechaInc.setValueState("None");
                }

                //flagValidacion = true; // -------------------------BORRAR LINEA -------------------------------------------------
                if (!flagValidacion) {
                    this.lineWizard.invalidateStep(this.byId("Datos_empleado"));
                } else {
                    this.lineWizard.validateStep(this.byId("Datos_empleado"));
                }


                //Si hay callback se devuelve el valor isValid
                if (callback) {
                    callback(flagValidacion);
                }

            },

            validarDNI: function (oEvent) {

                var data = this.datosEmpModel.getData();
                var txtdni = this.getView().byId("txtdnicif");

                if (data.tipoEmp === 'Interno' || data.tipoEmp === 'Gerente') {
                    var dni = oEvent.getParameter("value");
                    var number;
                    var letter;
                    var letterList;
                    var regularExp = /^\d{8}[a-zA-Z]$/;
                    //Se comprueba que el formato es válido 
                    if (regularExp.test(dni) === true) {
                        //Número
                        number = dni.substr(0, dni.length - 1);
                        //Letra
                        letter = dni.substr(dni.length - 1, 1);
                        number = number % 23;
                        letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                        letterList = letterList.substring(number, number + 1);
                        if (letterList !== letter.toUpperCase()) {
                            MessageToast.show("Error");
                            txtdni.setValueState("Error");
                        } else {
                            MessageToast.show("Correcto");
                            txtdni.setValueState("None");
                            //this.ValidacionEmpleado();// XXXXXXXXXXXXXXXXXXXXX
                        }
                    } else {
                        MessageToast.show("Error");
                        txtdni.setValueState("Error");
                    }
                }
            },

            goToReview: function (oEvent) {

                this.validaCampos(oEvent, function (isValid) {
                    if (isValid) {
                        //Se navega a la página review
                        var wizardNavContainer = this.byId("wizardNavContainer");
                        wizardNavContainer.to(this.byId("ReviewPage"));
                        //Se obtiene los archivos subidos
                        var uploadCollection = this.byId("UploadCollection");
                        var files = uploadCollection.getItems();
                        var numFiles = uploadCollection.getItems().length;
                        this.datosEmpModel.setProperty("/_numFiles", numFiles);
                        if (numFiles > 0) {
                            var arrayFiles = [];
                            for (var i in files) {
                                arrayFiles.push({ DocName: files[i].getFileName(), MimeType: files[i].getMimeType() });
                            }
                            this.datosEmpModel.setProperty("/_files", arrayFiles);
                        } else {
                            this.datosEmpModel.setProperty("/_files", []);
                        }
                    } else {
                        this.lineWizard.goToStep(this.byId("dataEmployeeStep"));
                    }
                }.bind(this));
                this._oNavContainer.to(this.byId("wizardReviewPage"));
            },


            editStepOne: function () {
                this._handleNavigationToStep.bind(this)('Tipo_empleado');
            },

            _handleNavigationToStep: function (iStepNumber) {
                var wizardNavContainer = this.byId("wizardNavContainer");

                var fnAfterNavigate = function () {
                    this.lineWizard.goToStep(this.byId(iStepNumber));
                    wizardNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                wizardNavContainer.attachAfterNavigate(fnAfterNavigate);
                wizardNavContainer.back();
            },

            editStepTwo: function () {
                this._handleNavigationToStep.bind(this)('Datos_empleado');
            },

            editStepThree: function () {
                this._handleNavigationToStep.bind(this)('info_adicional');
            },

            onBeforeUploadStart: function (oEvent) {
                var oCustomerHeaderSlug = new UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + this.newUser + ";" + oEvent.getParameter("fileName")
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            onChange: function (oEvent) {
                var oUploadCollection = oEvent.getSource();
                // Header Token
                var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("odataModel").getSecurityToken()
                });
                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },


            onCancelar: function () {


                sap.m.MessageBox.confirm(this.oView.getModel("i18n").getResourceBundle().getText("clicCancelar"), {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            //this.lineWizard.destroySteps();
                            //this.lineWizard.removeAllSteps();
                            this.limpiarDatos();
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteMain", {}, true);
                        }
                    }.bind(this)
                });

            },

            completedHandler: function (oEvent) {
                this.validaCampos(oEvent, function (isValid) {
                    if (isValid) {
                        //Se navega a la página review
                        var wizardNavContainer = this.byId("wizardNavContainer");
                        wizardNavContainer.to(this.byId("ReviewPage"));
                        //Se obtiene los archivos subidos
                        var uploadCollection = this.byId("UploadCollection");
                        var files = uploadCollection.getItems();
                        var numFiles = uploadCollection.getItems().length;
                        this.datosEmpModel.setProperty("/_numFiles", numFiles);
                        if (numFiles > 0) {
                            var arrayFiles = [];
                            for (var i in files) {
                                arrayFiles.push({ DocName: files[i].getFileName(), MimeType: files[i].getMimeType() });
                            }
                            this.datosEmpModel.setProperty("/_files", arrayFiles);
                        } else {
                            this.datosEmpModel.setProperty("/_files", []);
                        }
                    } else {
                        this.lineWizard.goToStep(this.byId("dataEmployeeStep"));
                    }
                }.bind(this));
            },



            guardarEmpleado: function () {
                var datosEmp = this.getView().getModel().getData();
                var body = {};
                body.EmployeeId = '';
                body.SapId = this.getOwnerComponent().SapId;
                body.Type = datosEmp.codeType;
                body.FirstName = datosEmp.Nombre;
                body.LastName = datosEmp.Apellido;
                body.Dni = datosEmp.DniCif;
                body.CreationDate = datosEmp.FechaIncorporacion;
                body.Comments = datosEmp.Comentario;


                body.UserToSalary = [{
                    Ammount: parseFloat(datosEmp.sliderValue).toString(),
                    Comments: datosEmp.Comentario,
                    Waers: "EUR"
                }];
                this.getView().setBusy(true);
                this.getView().getModel("odataModel").create("/Users", body, {
                    success: function (data) {
                        this.getView().setBusy(false);
                        //Se almacena el nuevo usuario
                        this.newUser = data.EmployeeId;
                        sap.m.MessageBox.information(this.oView.getModel("i18n").getResourceBundle().getText("empleadoNuevo") + ": " + this.newUser, {
                            onClose: function () {
                                //Se vuelve al wizard, para que al vovler a entrar a la aplicacion aparezca ahi
                                var wizardNavContainer = this.byId("wizardNavContainer");
                                wizardNavContainer.back();
                                //Regresamos al menú principal
                                //Se obtiene el conjuntos de routers del programa
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                //Se navega hacia el router "menu"
                                oRouter.navTo("RouteMain", {}, true);
                            }.bind(this)
                        });
                        //Se llama a la función "upload" del uploadCollection
                        this.onStartUpload();
                    }.bind(this),
                    error: function (e) {
                        this.getView().setBusy(false);
                        console.log("Error al crear");
                        console.log(e);
                        MessageToast.show("Error");
                    }.bind(this)
                });
            },
            limpiarDatos: function () {

                var txtNombre = this.getView().byId("txtNombre");
                var txtApellidos = this.getView().byId("txtApellidos");
                var txtdnicif = this.getView().byId("txtdnicif");
                var dpFechaInc = this.getView().byId("dpFechaInc");

                txtNombre.setValueState("None");
                txtApellidos.setValueState("None");
                txtdnicif.setValueState("None");
                dpFechaInc.setValueState("None");

                var step1 = this.lineWizard.getSteps()[0];
                this.lineWizard.discardProgress(step1);
                this.lineWizard.goToStep(step1);
                step1.setValidated(false);
                this.datosEmpModel.setData({});
            },

            onStartUpload: function (ioNum) {
                var that = this;
                var oUploadCollection = that.byId("UploadCollection");
                oUploadCollection.upload();
            }










        });
    });