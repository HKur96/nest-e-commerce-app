import { ApiResponse } from '@/utils/response/api.response';
import { AddressRepositoryInterface } from '../../domains/repositories/AddressRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { StateDto } from '../../domains/dtos/state.dto';
import { ProvinceDto } from '../../domains/dtos/province.dto';
import { CityDto } from '../../domains/dtos/city.dto';
import { SubDistrictDto } from '../../domains/dtos/subdistrict.dto';
import { WardDto } from '../../domains/dtos/ward.dto';
import { AddressResponse } from '../../domains/responses/address.response';

@Injectable()
export class AddressRepository implements AddressRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStates(): Promise<ApiResponse<AddressResponse[]>> {
    try {
      const states = await this.prisma.state.findMany();

      return ApiResponse.success(
        'success',
        states.map((state) => {
          return new AddressResponse(state.id, state.name);
        }),
      );
    } catch (error) {
      throw ApiResponse.error('Unhandle exception');
    }
  }

  async getAllProvinces(
    stateId: number,
  ): Promise<ApiResponse<AddressResponse[]>> {
    try {
      const provinces = await this.prisma.province.findMany({
        where: {
          stateId,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponse.success(
        'success',
        provinces.map((province) => {
          return new AddressResponse(province.id, province.name);
        }),
      );
    } catch (error) {
      throw ApiResponse.error('Unhandle exception');
    }
  }

  async getAllSubdistricts(
    cityId: number,
  ): Promise<ApiResponse<AddressResponse[]>> {
    try {
      const subdistricts = await this.prisma.subdistrict.findMany({
        where: {
          cityId,
        },
        orderBy: { name: 'asc' },
      });

      return ApiResponse.success(
        'success',
        subdistricts.map((subdistrict) => {
          return new AddressResponse(subdistrict.id, subdistrict.name);
        }),
      );
    } catch (error) {
      throw ApiResponse.error('Unhandle exception');
    }
  }

  async getAllWards(
    subdistrictId: number,
  ): Promise<ApiResponse<AddressResponse[]>> {
    try {
      const wards = await this.prisma.ward.findMany({
        where: {
          subdistrictId,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponse.success(
        'success',
        wards.map((ward) => {
          return new AddressResponse(ward.id, ward.name);
        }),
      );
    } catch (error) {
      throw ApiResponse.error('Unhandle exception');
    }
  }

  async getAllCities(
    provinceId: number,
  ): Promise<ApiResponse<AddressResponse[]>> {
    try {
      const cities = await this.prisma.city.findMany({
        where: {
          provinceId,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponse.success(
        'success',
        cities.map((city) => {
          console.log('lalala ', city);
          return new AddressResponse(city.id, city.name);
        }),
      );
    } catch (error) {
      throw ApiResponse.error('Unhandle exception');
    }
  }

  async createWard(dtos: WardDto[]): Promise<ApiResponse<boolean>> {
    try {
      if (!dtos.length) {
        return ApiResponse.error('Data should not be empty', 401);
      }

      await this.prisma.ward.createMany({
        skipDuplicates: true,
        data: dtos.map((dto) => {
          return {
            name: dto.name,
            subdistrictId: dto.subdistrict_id,
          };
        }),
      });

      return ApiResponse.success('Create a ward successfully', true);
    } catch (error) {
      throw ApiResponse.error('Unhandled exception');
    }
  }
  async createSubdistrict(
    dtos: SubDistrictDto[],
  ): Promise<ApiResponse<boolean>> {
    try {
      if (!dtos.length) {
        return ApiResponse.error('Data should not be empty', 401);
      }

      await this.prisma.subdistrict.createMany({
        skipDuplicates: true,
        data: dtos.map((dto) => {
          return {
            name: dto.name,
            cityId: dto.city_id,
          };
        }),
      });

      return ApiResponse.success('Create a subdistrict successfully', true);
    } catch (error) {
      throw ApiResponse.error('Unhandled exception');
    }
  }

  async createCity(dtos: CityDto[]): Promise<ApiResponse<boolean>> {
    try {
      if (!dtos.length) {
        return ApiResponse.error('Data should not be empty', 401);
      }

      await this.prisma.city.createMany({
        skipDuplicates: true,
        data: dtos.map((dto) => {
          return {
            name: dto.name,
            provinceId: dto.province_id,
          };
        }),
      });

      return ApiResponse.success('Create a city successfully', true);
    } catch (error) {
      throw ApiResponse.error('Unhandled exception');
    }
  }

  async createProvince(dtos: ProvinceDto[]): Promise<ApiResponse<boolean>> {
    try {
      if (!dtos.length) {
        return ApiResponse.error('Data should not be empty', 401);
      }

      await this.prisma.province.createMany({
        data: dtos.map((dto) => {
          return {
            name: dto.name,
            stateId: dto.state_id,
          };
        }),
        skipDuplicates: true,
      });

      return ApiResponse.success('Create a province successfully', true);
    } catch (error) {
      throw ApiResponse.error('Unhandled exception');
    }
  }

  async createState(dtos: StateDto[]): Promise<ApiResponse<boolean>> {
    try {
      if (!dtos.length) {
        return ApiResponse.error('Data should not be empty', 401);
      }

      await this.prisma.state.createMany({
        data: dtos.map((dto) => {
          return {
            name: dto.name,
            code: dto.code,
          };
        }),
        skipDuplicates: true,
      });

      return ApiResponse.success('Create a state successfully', true);
    } catch (error) {
      throw ApiResponse.error('Unhandled exception');
    }
  }

  upsertFullLocation(): Promise<ApiResponse> {
    throw new Error('Method not implemented.');
  }

  /**
     private async upsertFullLocation(data: NormalizedAddressInput) {
    const state = await this.prisma.state.upsert({
      where: { code: data.stateCode },
      update: {},
      create: {
        name: data.stateName,
        code: data.stateCode,
      },
    });

    const province = await this.prisma.province.upsert({
      where: {
        name_stateId: {
          name: data.provinceName,
          stateId: state.id,
        },
      },
      update: {},
      create: {
        name: data.provinceName,
        stateId: state.id,
      },
    });

    const city = await this.prisma.city.upsert({
      where: {
        name_provinceId: {
          name: data.cityName,
          provinceId: province.id,
        },
      },
      update: {},
      create: {
        name: data.cityName,
        provinceId: province.id,
      },
    });

    const subdistrict = await this.prisma.subdistrict.upsert({
      where: {
        name_cityId: {
          name: data.subdistrictName,
          cityId: city.id,
        },
      },
      update: {},
      create: {
        name: data.subdistrictName,
        cityId: city.id,
      },
    });

    const ward = await this.prisma.ward.upsert({
      where: {
        name_subdistrictId: {
          name: data.wardName,
          subdistrictId: subdistrict.id,
        },
      },
      update: {},
      create: {
        name: data.wardName,
        subdistrictId: subdistrict.id,
      },
    });

    return ward;
  }
     */
}
