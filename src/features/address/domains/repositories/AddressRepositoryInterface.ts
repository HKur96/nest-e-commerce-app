import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProvinceDto } from '../dtos/province.dto';
import { CityDto } from '../dtos/city.dto';
import { SubDistrictDto } from '../dtos/subdistrict.dto';
import { WardDto } from '../dtos/ward.dto';
import { AddressResponse } from '../responses/address.response';
import { UserData } from '@/utils/decorators/user.decorator';
import { UserAddress } from '../responses/userAddress.response';

export interface AddressRepositoryInterface {
  createProvince(dtos: ProvinceDto[]): Promise<ApiResponseDto<boolean>>;

  createCity(dtos: CityDto[]): Promise<ApiResponseDto<boolean>>;

  createSubdistrict(dtos: SubDistrictDto[]): Promise<ApiResponseDto<boolean>>;

  createWard(dtos: WardDto[]): Promise<ApiResponseDto<boolean>>;

  getAllProvinces(stateId: number): Promise<ApiResponseDto<AddressResponse[]>>;

  getAllCities(provinceId: number): Promise<ApiResponseDto<AddressResponse[]>>;

  getAllSubdistricts(cityId: number): Promise<ApiResponseDto<AddressResponse[]>>;

  getAllWards(subdistrictId: number): Promise<ApiResponseDto<AddressResponse[]>>;

  getUserAddress(user: UserData): Promise<ApiResponseDto<UserAddress[]>>;
}
