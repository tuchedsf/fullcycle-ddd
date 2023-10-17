import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLog1Handler from "./handler/EnviaConsoleLog1Handler.handler";
import EnviaConsoleLog2Handler from "./handler/EnviaConsoleLog2Handler.handler";

describe("Test events to customer created", () => {

    it ("should call events on created customer", () => {

         const eventDispatcher = new EventDispatcher();
         const event1Handler = new EnviaConsoleLog1Handler();
         const event2Handler = new EnviaConsoleLog2Handler();
         
         const spyEvent1Handler = jest.spyOn(event1Handler, "handle");
         const spyEvent2Handler = jest.spyOn(event2Handler, "handle");

         eventDispatcher.register("CustomerCreatedEvent", event1Handler);
         eventDispatcher.register("CustomerCreatedEvent", event2Handler);

         expect(
           eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
         ).toMatchObject(event1Handler);

          expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
          ).toMatchObject(event2Handler);

         const customerCreatedEvent = new CustomerCreatedEvent({
           id: "2343",
           name: "Customer 1",
         });

         // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
         eventDispatcher.notify(customerCreatedEvent);

         expect(spyEvent1Handler).toHaveBeenCalled();
         expect(spyEvent2Handler).toHaveBeenCalled();
    })
})