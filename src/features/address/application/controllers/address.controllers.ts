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
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { UserAddress } from '../../domains/responses/userAddress.response';
import { User, UserData } from '@/utils/decorators/user.decorator';

@ApiTags('Address')
@UseGuards(AuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressUseCase: AddressUseCase) {}

  @ApiOperation({ summary: 'Endpoint to create a province' })
  @ApiBody({
    type: ProvinceDto,
    isArray: true,
    required: true,
  })
  @ApiResponse({ type: Boolean })
  @Roles(Role.ADMIN)
  @Post('/province/create')
  createProvince(
    @Body() dtos: ProvinceDto[],
  ): Promise<ApiResponseDto<boolean>> {
    return this.addressUseCase.createProvince(dtos);
  }

  @ApiOperation({ summary: 'Endpoint to create a city' })
  @ApiBody({
    type: CityDto,
    isArray: true,
    required: true,
  })
  @ApiResponse({ type: Boolean })
  @Roles(Role.ADMIN)
  @Post('/city/create')
  createCity(@Body() dtos: CityDto[]): Promise<ApiResponseDto<boolean>> {
    return this.addressUseCase.createCity(dtos);
  }

  @ApiOperation({ summary: 'Endpoint to create a subdistrict' })
  @ApiBody({
    type: SubDistrictDto,
    isArray: true,
    required: true,
  })
  @ApiResponse({ type: Boolean })
  @Roles(Role.ADMIN)
  @Post('/subdistrict/create')
  createSubdistrict(
    @Body() dtos: SubDistrictDto[],
  ): Promise<ApiResponseDto<boolean>> {
    return this.addressUseCase.createSubdistrict(dtos);
  }

  @ApiOperation({ summary: 'Endpoint to create a ward' })
  @ApiBody({ type: WardDto, isArray: true, required: true })
  @ApiResponse({ type: Boolean })
  @Roles(Role.ADMIN)
  @Post('ward/create')
  createWard(@Body() dtos: WardDto[]): Promise<ApiResponseDto<boolean>> {
    return this.addressUseCase.createWard(dtos);
  }

  @ApiOperation({ summary: 'Endpoint to get provinces' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ type: AddressResponse, isArray: true })
  @Roles(Role.ADMIN, Role.USER, Role.SELLER)
  @Get('/province/:id')
  getAllProvinces(
    @Param('id', ParseIntPipe) stateId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressUseCase.getAllProvinces(stateId);
  }

  @ApiOperation({ summary: 'Endpoint to get cities' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ type: AddressResponse, isArray: true })
  @Roles(Role.ADMIN, Role.USER, Role.SELLER)
  @Get('/city/:id')
  getAllCity(
    @Param('id', ParseIntPipe) provinceId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressUseCase.getAllCities(provinceId);
  }

  @ApiOperation({ summary: 'Endpoint to get districts' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ type: AddressResponse, isArray: true })
  @Roles(Role.ADMIN, Role.USER, Role.SELLER)
  @Get('/subdistrict/:id')
  getAllSubdistricts(
    @Param('id', ParseIntPipe) cityId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressUseCase.getSubdistrict(cityId);
  }

  @ApiOperation({ summary: 'Endpoint to get wards' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ type: AddressResponse, isArray: true })
  @Roles(Role.ADMIN, Role.USER, Role.SELLER)
  @Get('/ward/:id')
  getAllWards(
    @Param('id', ParseIntPipe) subdistrictId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressUseCase.getWards(subdistrictId);
  }

  @ApiOperation({ summary: 'Endpoint to get user address by user id' })
  @ApiResponse({ type: UserAddress, isArray: true })
  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @Get()
  getUserAddress(
    @User() user: UserData,
  ): Promise<ApiResponseDto<UserAddress[]>> {
    return this.addressUseCase.getUserAddress(user);
  }
}
