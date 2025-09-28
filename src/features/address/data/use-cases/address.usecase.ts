import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../repositories/address.repository';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProvinceDto } from '../../domains/dtos/province.dto';
import { CityDto } from '../../domains/dtos/city.dto';
import { SubDistrictDto } from '../../domains/dtos/subdistrict.dto';
import { WardDto } from '../../domains/dtos/ward.dto';
import { AddressResponse } from '../../domains/responses/address.response';
import { UserAddress } from '../../domains/responses/userAddress.response';
import { UserData } from '@/utils/decorators/user.decorator';

@Injectable()
export class AddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async createProvince(dtos: ProvinceDto[]): Promise<ApiResponseDto<boolean>> {
    return this.addressRepository.createProvince(dtos);
  }

  async createCity(dtos: CityDto[]): Promise<ApiResponseDto<boolean>> {
    return this.addressRepository.createCity(dtos);
  }

  async createSubdistrict(
    dtos: SubDistrictDto[],
  ): Promise<ApiResponseDto<boolean>> {
    return this.addressRepository.createSubdistrict(dtos);
  }

  async createWard(dtos: WardDto[]): Promise<ApiResponseDto<boolean>> {
    return this.addressRepository.createWard(dtos);
  }

  async getAllProvinces(
    stateId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressRepository.getAllProvinces(stateId);
  }

  async getAllCities(
    provinceId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressRepository.getAllCities(provinceId);
  }

  async getSubdistrict(
    cityId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressRepository.getAllSubdistricts(cityId);
  }

  async getWards(
    subdistrictId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    return this.addressRepository.getAllWards(subdistrictId);
  }

  async getUserAddress(user: UserData): Promise<ApiResponseDto<UserAddress[]>> {
    return this.addressRepository.getUserAddress(user);
  }
}
