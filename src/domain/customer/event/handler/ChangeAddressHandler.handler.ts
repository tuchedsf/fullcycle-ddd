import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "../customer-change-address.event";

export default class ChangeAddressHandler
  implements EventHandlerInterface<CustomerChangeAddressEvent>
{
  handle(event: CustomerChangeAddressEvent): void {

    const { id, name, endereco } = event.eventData;

    console.log(
      `Endereço do cliente: ${id}, ${name}, alterado para: ${endereco}.`
    );
  }
}
