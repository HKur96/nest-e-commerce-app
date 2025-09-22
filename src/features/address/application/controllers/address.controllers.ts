import { Controller, Get } from "@nestjs/common";
import { AddressUseCase } from "../../data/use-cases/address.usecase";

@Controller("address")
export class AddressController {
    constructor (private readonly addressUseCase : AddressUseCase) {}

    @Get()
    henlo() {
        return "henlo"
    }
}