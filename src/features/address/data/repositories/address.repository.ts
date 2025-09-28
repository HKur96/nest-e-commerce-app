import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { AddressRepositoryInterface } from '../../domains/repositories/AddressRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { ProvinceDto } from '../../domains/dtos/province.dto';
import { CityDto } from '../../domains/dtos/city.dto';
import { SubDistrictDto } from '../../domains/dtos/subdistrict.dto';
import { WardDto } from '../../domains/dtos/ward.dto';
import { AddressResponse } from '../../domains/responses/address.response';
import { UserData } from '@/utils/decorators/user.decorator';
import { UserAddress } from '../../domains/responses/userAddress.response';

@Injectable()
export class AddressRepository implements AddressRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getUserAddress(user: UserData): Promise<ApiResponseDto<UserAddress[]>> {
    try {
      console.log('ppp', user.id)
      const addresses = await this.prisma.address.findMany({
        where: { userId: user.id },
        include: {
          province: { select: { name: true } },
          city: { select: { name: true } },
          subdistrict: { select: { name: true } },
          ward: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!addresses.length) {
        return ApiResponseDto.error('Address not found');
      }

      return ApiResponseDto.success(
        'Address successfully got',
        addresses.map<UserAddress>(
          (address) =>
            new UserAddress({
              id: address.id,
              street_name: address.streetName,
              ward_name: address.ward.name,
              subdistrict_name: address.subdistrict.name,
              city_name: address.city.name,
              province_name: address.province.name,
            }),
        ),
      );
    } catch (error) {
      return ApiResponseDto.error('Unexpected error');
    }
  }

  async getAllProvinces(
    stateId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    try {
      const provinces = await this.prisma.province.findMany({
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponseDto.success(
        'success',
        provinces.map((province) => {
          return new AddressResponse(province.id, province.name);
        }),
      );
    } catch (error) {
      throw ApiResponseDto.error('Unhandle exception');
    }
  }

  async getAllSubdistricts(
    cityId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    try {
      const subdistricts = await this.prisma.subdistrict.findMany({
        where: {
          cityId,
        },
        orderBy: { name: 'asc' },
      });

      return ApiResponseDto.success(
        'success',
        subdistricts.map((subdistrict) => {
          return new AddressResponse(subdistrict.id, subdistrict.name);
        }),
      );
    } catch (error) {
      throw ApiResponseDto.error('Unhandle exception');
    }
  }

  async getAllWards(
    subdistrictId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    try {
      const wards = await this.prisma.ward.findMany({
        where: {
          subdistrictId,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponseDto.success(
        'success',
        wards.map((ward) => {
          return new AddressResponse(ward.id, ward.name);
        }),
      );
    } catch (error) {
      throw ApiResponseDto.error('Unhandle exception');
    }
  }

  async getAllCities(
    provinceId: number,
  ): Promise<ApiResponseDto<AddressResponse[]>> {
    try {
      const cities = await this.prisma.city.findMany({
        where: {
          provinceId,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return ApiResponseDto.success(
        'success',
        cities.map((city) => {
          console.log('lalala ', city);
          return new AddressResponse(city.id, city.name);
        }),
      );
    } catch (error) {
      throw ApiResponseDto.error('Unhandle exception');
    }
  }

  async createWard(dtos: WardDto[]): Promise<ApiResponseDto<boolean>> {
    try {
      if (!dtos.length) {
        return ApiResponseDto.error('Data should not be empty', 401);
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

      return ApiResponseDto.success('Create a ward successfully', true);
    } catch (error) {
      throw ApiResponseDto.error('Unhandled exception');
    }
  }
  async createSubdistrict(
    dtos: SubDistrictDto[],
  ): Promise<ApiResponseDto<boolean>> {
    try {
      if (!dtos.length) {
        return ApiResponseDto.error('Data should not be empty', 401);
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

      return ApiResponseDto.success('Create a subdistrict successfully', true);
    } catch (error) {
      throw ApiResponseDto.error('Unhandled exception');
    }
  }

  async createCity(dtos: CityDto[]): Promise<ApiResponseDto<boolean>> {
    try {
      if (!dtos.length) {
        return ApiResponseDto.error('Data should not be empty', 401);
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

      return ApiResponseDto.success('Create a city successfully', true);
    } catch (error) {
      throw ApiResponseDto.error('Unhandled exception');
    }
  }

  async createProvince(dtos: ProvinceDto[]): Promise<ApiResponseDto<boolean>> {
    try {
      if (!dtos.length) {
        return ApiResponseDto.error('Data should not be empty', 401);
      }

      await this.prisma.province.createMany({
        data: dtos.map((dto) => {
          return {
            name: dto.name,
          };
        }),
        skipDuplicates: true,
      });

      return ApiResponseDto.success('Create a province successfully', true);
    } catch (error) {
      throw ApiResponseDto.error('Unhandled exception');
    }
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
