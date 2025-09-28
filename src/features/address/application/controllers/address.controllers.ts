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
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProvinceDto } from '../../domains/dtos/province.dto';
import { CityDto } from '../../domains/dtos/city.dto';
import { SubDistrictDto } from '../../domains/dtos/subdistrict.dto';
import { WardDto } from '../../domains/dtos/ward.dto';
import { AuthGuard } from '@/utils/guards/auth.guard';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { AddressResponse } from '../../domains/responses/address.response';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { UserAddress } from '../../domains/responses/userAddress.response';
import { User, UserData } from '@/utils/decorators/user.decorator';

@ApiTags('Address')
@UseGuards(AuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressUseCase: AddressUseCase) {}

  @ApiCreatedResponse({ description: 'Province successfully created' })
  @Roles(Role.ADMIN)
  @Post('/province/create')
  createProvince(
    @Body() dtos: ProvinceDto[],
  ): Promise<ApiResponseDto<boolean>> {
    return this.addressUseCase.createProvince(dtos);
  }

  @ApiCreatedResponse({ description: 'City successfully created' })
  @Roles(Role.ADMIN)
  @Post('/city/create')
  createCity(@Body() dtos: CityDto[]): Promise<ApiResponseDto<boolean>> {
    return this.addressUseCase.createCity(dtos);
  }

  @ApiCreatedResponse({ description: 'Subdistrict successfully created' })
  @Roles(Role.ADMIN)
  @Post('/subdistrict/create')
  createSubdistrict(
    @Body() dtos: SubDistrictDto[],
  ): Promise<ApiResponseDto<boolean>> {
    return this.addressUseCase.createSubdistrict(dtos);
  }

  @ApiCreatedResponse({ description: 'Ward successfully created' })
  @Roles(Role.ADMIN)
  @Post('ward/create')
  createWard(@Body() dtos: WardDto[]): Promise<ApiResponseDto<boolean>> {
    return this.addressUseCase.createWard(dtos);
  }

  @ApiCreatedResponse({ description: 'Province successfully got' })
  @Roles(Role.ADMIN, Role.USER, Role.SELLER)
  @Get('/province/:id')
  getAllProvinces(
    @Param('id', ParseIntPipe) stateId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressUseCase.getAllProvinces(stateId);
  }

  @ApiCreatedResponse({ description: 'City successfully got' })
  @Roles(Role.ADMIN, Role.USER, Role.SELLER)
  @Get('/city/:id')
  getAllCity(
    @Param('id', ParseIntPipe) provinceId: number,
  ): Promise<ApiResponseDto> {
    return this.addressUseCase.getAllCities(provinceId);
  }

  @ApiCreatedResponse({ description: 'Subdistrict successfully got' })
  @Roles(Role.ADMIN, Role.USER, Role.SELLER)
  @Get('/subdistrict/:id')
  getAllSubdistricts(
    @Param('id', ParseIntPipe) cityId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressUseCase.getSubdistrict(cityId);
  }

  @ApiCreatedResponse({ description: 'Ward successfully got' })
  @Roles(Role.ADMIN, Role.USER, Role.SELLER)
  @Get('/ward/:id')
  getAllWards(
    @Param('id', ParseIntPipe) subdistrictId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressUseCase.getWards(subdistrictId);
  }

  @ApiCreatedResponse({ description: 'Address successfully got' })
  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @Get()
  getUserAddress(
    @User() user: UserData,
  ): Promise<ApiResponseDto<UserAddress[]>> {
    return this.addressUseCase.getUserAddress(user);
  }
}
