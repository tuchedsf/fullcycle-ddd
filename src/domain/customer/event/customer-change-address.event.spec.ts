import EventDispatcher from "../../@shared/event/event-dispatcher";
import Address from "../value-object/address";
import CustomerChangeAddressEvent from "./customer-change-address.event";
import ChangeAddressHandler from "./handler/ChangeAddressHandler.handler";

describe("Test events to customer address change", () => {

    it ("should call events on customer address change", () => {

         const eventDispatcher = new EventDispatcher();
         const eventHandler = new ChangeAddressHandler();
         
         const spyEventHandler = jest.spyOn(eventHandler, "handle");

         eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);
         
         expect(
           eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]
         ).toMatchObject(eventHandler);

         const address = new Address("Rua Topazio", 132, "31160000", "Itabira");
         
         const changeAddressHandler = new CustomerChangeAddressEvent({
           id: "2343",
           name: "Customer 1",
           endereco: address
         });
    

         // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(changeAddressHandler);

         expect(spyEventHandler).toHaveBeenCalled();
    })
})