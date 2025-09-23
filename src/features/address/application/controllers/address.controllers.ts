import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddressUseCase } from '../../data/use-cases/address.usecase';
import { ApiResponse } from '@/utils/response/api.response';
import { StateDto } from '../../domains/dtos/state.dto';
import { ProvinceDto } from '../../domains/dtos/province.dto';
import { CityDto } from '../../domains/dtos/city.dto';
import { SubDistrictDto } from '../../domains/dtos/subdistrict.dto';
import { WardDto } from '../../domains/dtos/ward.dto';
import { AuthGuard } from '@/utils/guards/auth.guard';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { AddressResponse } from '../../domains/responses/address.response';

@UseGuards(AuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressUseCase: AddressUseCase) {}

  @Roles(Role.ADMIN)
  @Post('/state/create')
  createState(@Body() dtos: StateDto[]): Promise<ApiResponse<boolean>> {
    return this.addressUseCase.createState(dtos);
  }

  @Roles(Role.ADMIN)
  @Post('/province/create')
  createProvince(@Body() dtos: ProvinceDto[]): Promise<ApiResponse<boolean>> {
    return this.addressUseCase.createProvince(dtos);
  }

  @Roles(Role.ADMIN)
  @Post('/city/create')
  createCity(@Body() dtos: CityDto[]): Promise<ApiResponse<boolean>> {
    return this.addressUseCase.createCity(dtos);
  }

  @Roles(Role.ADMIN)
  @Post('/subdistrict/create')
  createSubdistrict(
    @Body() dtos: SubDistrictDto[],
  ): Promise<ApiResponse<boolean>> {
    return this.addressUseCase.createSubdistrict(dtos);
  }

  @Roles(Role.ADMIN)
  @Post('ward/create')
  createWard(@Body() dtos: WardDto[]): Promise<ApiResponse<boolean>> {
    return this.addressUseCase.createWard(dtos);
  }

  @Roles(Role.ADMIN, Role.BUYER, Role.SELLER)
  @Get('/state')
  getAllStates(): Promise<ApiResponse<AddressResponse[]>> {
    return this.addressUseCase.getAllStates();
  }

  @Roles(Role.ADMIN, Role.BUYER, Role.SELLER)
  @Get('/province/:id')
  getAllProvinces(
    @Param('id', ParseIntPipe) stateId: number,
  ): Promise<ApiResponse<AddressResponse[]>> {
    return this.addressUseCase.getAllProvinces(stateId);
  }

  @Roles(Role.ADMIN, Role.BUYER, Role.SELLER)
  @Get('/city/:id')
  getAllCity(
    @Param('id', ParseIntPipe) provinceId: number,
  ): Promise<ApiResponse> {
    return this.addressUseCase.getAllCities(provinceId);
  }

  @Roles(Role.ADMIN, Role.BUYER, Role.SELLER)
  @Get('/subdistrict/:id')
  getAllSubdistricts(
    @Param('id', ParseIntPipe) cityId: number,
  ): Promise<ApiResponse<AddressResponse[]>> {
    return this.addressUseCase.getSubdistrict(cityId);
  }

  @Roles(Role.ADMIN, Role.BUYER, Role.SELLER)
  @Get('/ward/:id')
  getAllWards(
    @Param('id', ParseIntPipe) subdistrictId: number,
  ): Promise<ApiResponse<AddressResponse[]>> {
    return this.addressUseCase.getWards(subdistrictId);
  }
}
