import { Injectable } from "@nestjs/common";
import { AddressRepository } from "../repositories/address.repository";

@Injectable()
export class AddressUseCase {
    constructor (private readonly addressRepository: AddressRepository) {

    }
}