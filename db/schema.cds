namespace db;

using {
    cuid,
    managed
} from '@sap/cds/common'; // importing aspects to be used in the schema

entity PurchaseOrder : cuid, managed{
    key PurchaseOrderID   : UUID;
    PurchaseOrderType     : String(10);      // Example: 'NB'
    DocumentCurrency      : String(30);
    PurchasingGroup       : String(3);       // Example: '001'
    PurchasingOrganization: String(4);       // Example: '1710'
    CompanyCode           : String(4);       // Example: '1710'
    AddressName           : String(255);
    Language             : String(2);        // Example: 'EN'
}


