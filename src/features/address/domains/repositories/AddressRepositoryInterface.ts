import { ApiResponse } from '@/utils/response/api.response';
import { StateDto } from '../dtos/state.dto';
import { ProvinceDto } from '../dtos/province.dto';
import { CityDto } from '../dtos/city.dto';
import { SubDistrictDto } from '../dtos/subdistrict.dto';
import { WardDto } from '../dtos/ward.dto';

export interface AddressRepositoryInterface {
  upsertFullLocation(): Promise<ApiResponse>;

  createState(dto: StateDto[]): Promise<ApiResponse<boolean>>;

  createProvince(dtos: ProvinceDto[]): Promise<ApiResponse<boolean>>;

  createCity(dtos: CityDto[]): Promise<ApiResponse<boolean>>;

  createSubdistrict(dtos: SubDistrictDto[]): Promise<ApiResponse<boolean>>;

  createWard(dtos: WardDto[]): Promise<ApiResponse<boolean>>;
}
