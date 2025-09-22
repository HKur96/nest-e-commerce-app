import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../repositories/address.repository';
import { StateDto } from '../../domains/dtos/state.dto';
import { ApiResponse } from '@/utils/response/api.response';
import { ProvinceDto } from '../../domains/dtos/province.dto';
import { CityDto } from '../../domains/dtos/city.dto';
import { SubDistrictDto } from '../../domains/dtos/subdistrict.dto';
import { WardDto } from '../../domains/dtos/ward.dto';

@Injectable()
export class AddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async createState(dtos: StateDto[]): Promise<ApiResponse<boolean>> {
    return this.addressRepository.createState(dtos);
  }

  async createProvince(dtos: ProvinceDto[]): Promise<ApiResponse<boolean>> {
    return this.addressRepository.createProvince(dtos);
  }

  async createCity(dtos: CityDto[]): Promise<ApiResponse<boolean>> {
    return this.addressRepository.createCity(dtos);
  }

  async createSubdistrict(
    dtos: SubDistrictDto[],
  ): Promise<ApiResponse<boolean>> {
    return this.addressRepository.createSubdistrict(dtos);
  }

  async createWard(dtos: WardDto[]): Promise<ApiResponse<boolean>> {
    return this.addressRepository.createWard(dtos);
  }
}
