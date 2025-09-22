import { ApiResponse } from '@/utils/response/api.response';
import { AddressRepositoryInterface } from '../../domains/repositories/AddressRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/config/prisma/prisma.service';

@Injectable()
export class AddressRepository implements AddressRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

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
