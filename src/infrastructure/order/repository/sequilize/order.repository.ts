import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    const updatedItems = entity.items.map(orderItemToDatabase);
    const items = await OrderItemModel.findAll({
      where: { order_id: entity.id },
    });

    for (const updatedItem of updatedItems) {
      const itemExistsOnDB = items.find((items) => items.id === updatedItem.id);

      if (!itemExistsOnDB) {

        await OrderItemModel.create({
          id: updatedItem.id,
          product_id: updatedItem.productId,
          order_id: entity.id,
          quantity: updatedItem.quantity,
          name: updatedItem.name,
          price: updatedItem.unitPrice
        });
      }
    }

    for (const itemOnDB of items) {
      const itemExistsOnUpdatedItems = updatedItems.find(
        (updatedItem) => updatedItem.id === itemOnDB.id
      );

      if (!itemExistsOnUpdatedItems) {
        await OrderItemModel.destroy({ where: { id: itemOnDB.id } });
      }
    }

    await OrderModel.update(
      { total: entity.total() },
      { where: { id: entity.id } }
    );
  }


  async findAll(): Promise<Order[]> {

    const ordersModel = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    const orders = ordersModel.map((ordersModel) => {
      const items = ordersModel.items.map(transformOrderItemModelEmOrderItem);
      const order = new Order(ordersModel.id, ordersModel.customer_id, items);
      return order;
    });

    return orders;

  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel }],
    });
    const items = orderModel.items.map(transformOrderItemModelEmOrderItem);
    return new Order(orderModel.id, orderModel.customer_id, items);
  }

}

 function transformOrderItemModelEmOrderItem(orderItemModel: OrderItemModel): OrderItem {
   return new OrderItem(
     orderItemModel.id,
     orderItemModel.name,
     orderItemModel.price,
     orderItemModel.product_id,
     orderItemModel.quantity
   );
 }

 function orderItemToDatabase(orderItem: OrderItem) {
   return {
     id: orderItem.id,
     productId: orderItem.productId,
     name: orderItem.name,
     unitPrice: orderItem.price,
     quantity: orderItem.quantity,
   };
 }
