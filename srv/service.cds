using { db as my } from '../db/schema';

service MyService {

    action PostPurchaseOrderData(encode : String) returns String;

    action getPurchaseOrderList() returns String;

    action getPurchaseOrderItems() returns String;

}
