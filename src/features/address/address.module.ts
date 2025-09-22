import { PrismaModule } from "@/infra/config/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { AddressController } from "./application/controllers/address.controllers";
import { AddressUseCase } from "./data/use-cases/address.usecase";
import { AddressRepository } from "./data/repositories/address.repository";

@Module({
    imports: [PrismaModule],
    controllers: [AddressController],
    providers: [AddressRepository, AddressUseCase],
})
export class AddressModule {}