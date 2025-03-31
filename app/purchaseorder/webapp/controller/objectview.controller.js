sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller , MessageBox) => {
    "use strict";

    return Controller.extend("purchaseorder.controller.objectview", {
        onInit() {
            const oModel  = new sap.ui.model.json.JSONModel({
                payload : {
                    "CompanyCode": "",
                    "PurchaseOrderType": "",
                    "PurchasingGroup": "",
                    "PurchasingOrganization": "",
                    "Supplier": "",
                    "_PurchaseOrderItem": []
                }
                   
            });
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            console.log("🔹 Attaching route handlers...");
            oRouter.getRoute("Routecreateobjectview").attachPatternMatched(this._onCreateMatched.bind(this));
            oRouter.getRoute("Routeobjectview").attachPatternMatched(this._onObjectMatched, this);
            

            this.getView().setModel(oModel,'oModel');
        },

         /** 🔹 Fetch Data when Navigating to Object View */
         _onObjectMatched: function (oEvent) {
            const sPurchaseOrderId = oEvent.getParameter("arguments").purchaseOrderId; // Get Purchase Order ID from URL
            
             //Avoid calling service if no purchaseOrderId (when creating new)
            if (!sPurchaseOrderId || sPurchaseOrderId === "createobject") {
                console.warn("Skipping GET call because no purchaseOrderId is present.");
                return;
            }
            const oModel = this.getView().getModel("oModel");
            const serviceUrl = this.getOwnerComponent().getModel().getServiceUrl();
            // const items = oModel.getProperty("/OrderItems");

            // Perform GET Request to Fetch Order Data
            $.ajax({
                url: serviceUrl + "getPurchaseOrderList?purchaseOrderId=" + sPurchaseOrderId,
                type: "POST",
                contentType: "application/json",
                success: function (response) {
                    if (response) {
                        console.log("Success:", response.value.value[0]);
                        oModel.setProperty("/payload", response.value.value[0]);
                    } else {
                        MessageBox.error("Purchase Order not found!");
                    }

                // Fetch Purchase Order Items separately
                $.ajax({
                    url: serviceUrl + "getPurchaseOrderItems?purchaseOrderId=" + sPurchaseOrderId,
                    type: "POST",
                    contentType: "application/json",
                    success: function (itemResponse) {
                            // Extract the correct array of items
                        const rawItems = itemResponse.value?.value || [];
                        console.log("Raw Items from API:", rawItems);

                        // Ensure sPurchaseOrderId is properly formatted
                        console.log("Filtering for Purchase Order ID:", sPurchaseOrderId);

                        const filteredItems = rawItems.filter(item => item.PurchaseOrder === sPurchaseOrderId);
                        console.log("Filtered Items:", filteredItems);
                
                        // Set filtered items to the model
                        oModel.setProperty("/payload/_PurchaseOrderItem", filteredItems);
                        console.log("Filtered Items set successfully:", filteredItems);

                        // // if (itemResponse && itemResponse.value.value && itemResponse.value.value.length > 0) {
                        //     oModel.setProperty("/payload/_PurchaseOrderItem", itemResponse.value.value[0]);
                        //     console.log("Filtered Items set successfully:", itemResponse.value.value[0]);
                            
                        // } else {
                        //     oModel.setProperty("/payload/_PurchaseOrderItem", []); // Set empty if no items found
                        //     console.warn("No items found for this Purchase Order ID.");
                        // }
                    },
                    error: function (oError) {
                        console.error("Error fetching purchase order items:", oError);
                        oModel.setProperty("/payload/_PurchaseOrderItem", []); // Set empty array if error
                    }
                    
                });
            },
            error: function (oError) {
                console.error("Error fetching purchase order data:", oError);
                MessageBox.error("Failed to load Purchase Order data.");
            }
                
            });
        },

        /** 🔹 Reset Data when Navigating to Create View */
        _onCreateMatched: function () {
            console.log("_onCreateMatched triggered! Resetting model...");
            const oModel = this.getView().getModel("oModel");
            oModel.setProperty("/payload", {
                "CompanyCode": "",
                "PurchaseOrderType": "",
                "PurchasingGroup": "",
                "PurchasingOrganization": "",
                "Supplier": "",
                "_PurchaseOrderItem": []
            });
            oModel.refresh(true);  // true forces re-rendering of bindings
        },

        onAddItems: function (){
            const oModel = this.getView().getModel('oModel');
            const oData = oModel.getData();

            if (!oData.payload._PurchaseOrderItem) {
                oData.payload._PurchaseOrderItem = [];
            }

            // Create a new item object with empty values
            const newItem = {
                "Plant": "",
                "PurchaseOrderItem": String((oData.payload._PurchaseOrderItem.length + 1) * 10),
                "OrderQuantity": "",
                "Material": "",
                "PurchaseOrderQuantityUnit": "",
                "NetPriceAmount": "",
                "DocumentCurrency": ""
            };

            // Add the new item to the array
            oData.payload._PurchaseOrderItem.push(newItem);
            //oModel.setProperty("/OrderItems",newItem)
            oModel.refresh();
        },
        onSubmitOrder : function (){
            const oModel = this.getView().getModel('oModel');
            const oData = oModel.getData();
            const payload = oModel.getData().payload;
            const serviceUrl = this.getOwnerComponent().getModel().getServiceUrl();

            // Convert OrderQuantity and NetPriceAmount to numbers
            oData.payload._PurchaseOrderItem.forEach(item => {
                item.OrderQuantity = item.OrderQuantity ? parseInt(item.OrderQuantity, 10) : 0;
                item.NetPriceAmount = item.NetPriceAmount ? parseFloat(item.NetPriceAmount) : 0.00;
            });

            // Convert payload to Base64
            const jsonString = JSON.stringify(payload);
            const encodedData = btoa(jsonString);

            const requestData = { encode: encodedData };

             // Perform POST Call
             $.ajax({
                url: serviceUrl + "PostPurchaseOrderData",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestData),
                success: function (response) {
                    MessageBox.show("Purchase Order submitted successfully!");
                    
                    window.history.go(-1);

                    let table = that.byId("requestTable");
                    table.getBinding("items").refresh();
                },
                error: function (oError) {
                    console.error("Error fetching data:", oError);
                }
            });

        }
    });
});