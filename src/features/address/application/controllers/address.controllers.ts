import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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

@UseGuards(AuthGuard)
@Roles(Role.ADMIN)
@Controller('address')
export class AddressController {
  constructor(private readonly addressUseCase: AddressUseCase) {}

  @Post('/state/create')
  createState(@Body() dtos: StateDto[]): Promise<ApiResponse<boolean>> {
    return this.addressUseCase.createState(dtos);
  }

  @Post('/province/create')
  createProvince(@Body() dtos: ProvinceDto[]): Promise<ApiResponse<boolean>> {
    return this.addressUseCase.createProvince(dtos);
  }

  @Post('city/create')
  createCity(@Body() dtos: CityDto[]): Promise<ApiResponse<boolean>> {
    return this.addressUseCase.createCity(dtos);
  }

  @Post('subdistrict/create')
  createSubdistrict(
    @Body() dtos: SubDistrictDto[],
  ): Promise<ApiResponse<boolean>> {
    return this.addressUseCase.createSubdistrict(dtos);
  }

  @Post('ward/create')
  createWard(@Body() dtos: WardDto[]): Promise<ApiResponse<boolean>> {
    return this.addressUseCase.createWard(dtos);
  }
}
